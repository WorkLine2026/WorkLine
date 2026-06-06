import { Component, EventEmitter, Output, ViewEncapsulation, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Service/auth.service';

@Component({
  selector: 'app-registerperson',
  imports: [CommonModule, FormsModule],
  templateUrl: './registerperson.html',
  styleUrl: './registerperson.scss',
  encapsulation: ViewEncapsulation.None
})
export class Registerperson implements OnDestroy {
  @Output() closed       = new EventEmitter<void>();
  @Output() registered   = new EventEmitter<void>();

  currentStep = 1;
  showPassword        = false;
  showConfirmPassword = false;

  isLoading    = false;
  errorMessage = '';

  verificationCode: string[] = ['', '', '', '', '', ''];
  verificationError   = false;
  verificationSuccess = false;
  resendTimer         = 0;
  private resendInterval: ReturnType<typeof setInterval> | null = null;

  stepTitles = ['პირადი ინფო', 'გამოცდილება', 'ანგარიშის შექმნა', 'ვერიფიკაცია'];
  stepSubs   = [
    'შეავსეთ თქვენი პირადი მონაცემები',
    'გვიამბეთ თქვენი გამოცდილების შესახებ',
    'შეიყვანეთ საკონტაქტო ინფორმაცია',
    '',
  ];

  step1 = { firstName: '', lastName: '', birthDate: '', gender: '', idNumber: '', city: '' };
  step2 = { sector: '', experience: '', availability: '', schedules: [] as string[] };
  step3 = { phone: '', email: '', password: '', confirmPassword: '' };

  cities   = ['თბილისი','ბათუმი','ქუთაისი','რუსთავი','გორი','ზუგდიდი','სხვა'];
  sectors  = ['მოლარე','მიმტანი / ბარმენი','მზარეული / მომხარშავი','საწყობის თანამშრომელი',
               'მოსაწყობი / პრომოუტერი','მოვლის პერსონალი','ქოლ-ცენტრის ოპერატორი','დამლაგებელი','სხვა'];
  availabilities = ['ამ კვირაში','1–2 კვირაში','1 თვეში','ნებისმიერ დროს'];
  schedules      = ['სრული განაკვეთი','ნახევარი განაკვეთი','მხოლოდ დღე','მხოლოდ ღამე','შაბათ-კვირა'];

  constructor(
    private authService: AuthService, 
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  goNext(): void {
    this.errorMessage = '';
    if (!this.validateStep(this.currentStep)) return;
    if (this.currentStep < 3) this.currentStep++;
  }

  goBack(): void {
    this.errorMessage = '';
    if (this.currentStep > 1) this.currentStep--;
  }

  close(): void { 
    this.closed.emit(); 
  }

  private validateStep(step: number): boolean {
    if (step === 1) {
      const { firstName, lastName, birthDate, gender, idNumber, city } = this.step1;
      if (!firstName || !lastName || !birthDate || !gender || !idNumber || !city) {
        this.errorMessage = 'გთხოვთ შეავსოთ ყველა ველი.';
        return false;
      }
      if (!/^\d{11}$/.test(idNumber)) {
        this.errorMessage = 'პირადი ნომერი უნდა შეიცავდეს ზუსტად 11 ციფრს.';
        return false;
      }
    }
    if (step === 2) {
      const { sector, experience, availability } = this.step2;
      if (!sector || !experience || !availability) {
        this.errorMessage = 'გთხოვთ შეავსოთ ყველა ველი.';
        return false;
      }
    }
    return true;
  }

  private validateStep3(): boolean {
    const { phone, email, password, confirmPassword } = this.step3;
    if (!phone || !email || !password || !confirmPassword) {
      this.errorMessage = 'გთხოვთ შეავსოთ ყველა ველი.';
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.errorMessage = 'ელ-ფოსტის ფორმატი არასწორია.';
      return false;
    }
    if (password.length < 8) {
      this.errorMessage = 'პაროლი მინიმუმ 8 სიმბოლოს უნდა შეიცავდეს.';
      return false;
    }
    if (password !== confirmPassword) {
      this.errorMessage = 'პაროლები არ ემთხვევა.';
      return false;
    }
    return true;
  }

  submit(): void {
    this.errorMessage = '';
    if (!this.validateStep3()) return;

    this.isLoading = true;

    this.authService.registerPerson({
      ...this.step1,
      ...this.step2,
      phone:    this.step3.phone,
      email:    this.step3.email,
      password: this.step3.password,
    }).subscribe({
      next: () => {
        this.zone.run(() => {
          this.isLoading   = false;
          this.currentStep = 4;
          this.startResendTimer();
          
          // მომენტალურად აიძულებს ეკრანის განახლებას
          this.cdr.detectChanges(); 
          
          // ფოკუსი პირველ input-ზე
          setTimeout(() => {
            this.focusInput(0);
          }, 50);
        });
      },
      error: (err: Error) => {
        this.zone.run(() => {
          this.isLoading    = false;
          this.errorMessage = err.message;
          this.cdr.detectChanges();
        });
      },
    });
  }

  onDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const val   = input.value.replace(/\D/g, '');

    if (val.length === 6) {
      this.verificationCode  = val.split('');
      this.verificationError = false;
      this.focusInput(5);
      return;
    }

    this.verificationCode[index] = val.slice(-1);
    this.verificationError = false;
    if (val && index < 5) this.focusInput(index + 1);
  }

  onDigitKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.verificationCode[index] && index > 0) {
      this.focusInput(index - 1);
    }
  }

  onDigitPaste(event: ClipboardEvent, index: number): void {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text').replace(/\D/g, '') ?? '';
    if (!pasted) return;
    const digits = pasted.slice(0, 6).split('');
    digits.forEach((d, i) => { if (index + i < 6) this.verificationCode[index + i] = d; });
    this.verificationError = false;
    this.focusInput(Math.min(index + digits.length - 1, 5));
  }

  private focusInput(index: number): void {
    setTimeout(() => {
      const el = document.querySelector<HTMLInputElement>(`.rp-otp-input:nth-child(${index + 1})`);
      el?.focus();
    });
  }

  get enteredCode(): string { 
    return this.verificationCode.join(''); 
  }

  verifyCode(): void {
    if (this.enteredCode.length < 6 || this.isLoading) return;

    this.isLoading         = true;
    this.verificationError = false;
    this.cdr.detectChanges();

    this.authService.verifyPersonEmail({ email: this.step3.email, code: this.enteredCode })
      .subscribe({
        next: () => {
          this.zone.run(() => {
            this.isLoading           = false;
            this.verificationSuccess = true;
            this.cdr.detectChanges(); 

            setTimeout(() => {
              this.registered.emit();
              this.close();
            }, 1500);
          });
        },
        error: (err: Error) => {
          this.zone.run(() => {
            this.isLoading         = false;
            this.verificationError = true;
            this.verificationCode  = ['', '', '', '', '', ''];
            this.errorMessage      = err.message;
            this.cdr.detectChanges();
            this.focusInput(0);
          });
        },
      });
  }

  resendCode(): void {
    if (this.resendTimer > 0 || this.isLoading) return;

    this.isLoading    = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.authService.resendPersonCode(this.step3.email).subscribe({
      next: () => {
        this.zone.run(() => {
          this.isLoading         = false;
          this.verificationCode  = ['', '', '', '', '', ''];
          this.verificationError = false;
          this.startResendTimer();
          this.cdr.detectChanges();
          this.focusInput(0);
        });
      },
      error: (err: Error) => {
        this.zone.run(() => {
          this.isLoading    = false;
          this.errorMessage = err.message;
          this.cdr.detectChanges();
        });
      },
    });
  }

  private startResendTimer(): void {
    this.resendTimer = 60;
    this.resendInterval = setInterval(() => {
      this.zone.run(() => {
        this.resendTimer--;
        if (this.resendTimer <= 0 && this.resendInterval) {
          clearInterval(this.resendInterval);
          this.resendInterval = null;
        }
        this.cdr.detectChanges(); // ტაიმერის განახლებისთვის ეკრანზე
      });
    }, 1000);
  }

  isScheduleSelected(s: string): boolean { 
    return this.step2.schedules.includes(s); 
  }

  toggleSchedule(s: string): void {
    const idx = this.step2.schedules.indexOf(s);
    if (idx > -1) this.step2.schedules.splice(idx, 1);
    else          this.step2.schedules.push(s);
  }

  ngOnDestroy(): void {
    if (this.resendInterval) clearInterval(this.resendInterval);
  }
}