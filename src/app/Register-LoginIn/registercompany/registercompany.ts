import { Component, EventEmitter, Output, ViewEncapsulation, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { timeout, finalize } from 'rxjs/operators'; // ✅ დაამატე finalize

import { AuthService } from '../../Service/auth.service';
import { AuthStateService } from '../../Service/auth-state.service';
import {
  CompanyInfo,
  ContactInfo,
  PasswordStrength,
  CompanyProfile,
  VerifyResponse
} from '../../Models/company-registration.model';

@Component({
  selector: 'app-registercompany',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registercompany.html',
  styleUrl: './registercompany.scss',
  encapsulation: ViewEncapsulation.None
})
export class RegistercompanyComponent implements OnDestroy {
  @Output() closed = new EventEmitter<void>();

  currentStep = 1;
  isLoading   = false;

  step1: CompanyInfo = { name: '', identificationCode: '', sector: '', city: '' };
  errors1: Partial<Record<keyof CompanyInfo, string>> = {};

  step2: ContactInfo = { phone: '', email: '', password: '', confirmPassword: '' };
  errors2: Partial<Record<keyof ContactInfo, string>> = {};
  showPassword        = false;
  showConfirmPassword = false;

  verificationCode: string[] = ['', '', '', '', '', ''];
  verifyError      = '';
  registeredEmail  = '';
  resendCooldown   = 0;
  private resendTimer?: ReturnType<typeof setInterval>;

  readonly sectors = [
    'სუპერმარკეტი', 'რესტორანი / კაფე', 'სასტუმრო',
    'საწყობი', 'აფთიაქი', 'სავაჭრო ცენტრი', 'ქოლ-ცენტრი', 'სხვა'
  ];

  readonly cities = [
    'თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'გორი', 'ზუგდიდი', 'სხვა'
  ];

  constructor(
    private router:      Router,
    private authService: AuthService,
    private authState:   AuthStateService
  ) {}

  ngOnDestroy(): void {
    clearInterval(this.resendTimer);
  }

  private validateStep1(): boolean {
    this.errors1 = {};

    if (!this.step1.name.trim())
      this.errors1.name = 'კომპანიის სახელი სავალდებულოა';

    const code = this.step1.identificationCode.trim();
    if (!code)
      this.errors1.identificationCode = 'საიდენტიფიკაციო კოდი სავალდებულოა';
    else if (!/^\d{9}$/.test(code))
      this.errors1.identificationCode = 'ზუსტად 9 ციფრი';

    if (!this.step1.sector)
      this.errors1.sector = 'სფეროს არჩევა სავალდებულოა';

    if (!this.step1.city)
      this.errors1.city = 'ქალაქის არჩევა სავალდებულოა';

    return Object.keys(this.errors1).length === 0;
  }

  private validateStep2(): boolean {
    this.errors2 = {};

    const phone = this.step2.phone.trim();
    if (!phone)
      this.errors2.phone = 'ტელეფონი სავალდებულოა';
    else if (!/^(\+995|995|0)?[5][0-9]{8}$/.test(phone.replace(/\s/g, '')))
      this.errors2.phone = 'სწორი ქართული ნომერი (+995 5XX XXX XXX)';

    const email = this.step2.email.trim();
    if (!email)
      this.errors2.email = 'ელ-ფოსტა სავალდებულოა';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      this.errors2.email = 'სწორი ელ-ფოსტის მისამართი';

    const pw = this.step2.password;
    if (!pw)
      this.errors2.password = 'პაროლი სავალდებულოა';
    else if (pw.length < 8)
      this.errors2.password = 'მინიმუმ 8 სიმბოლო';
    else if (!/[A-Z]/.test(pw))
      this.errors2.password = 'მინიმუმ ერთი დიდი ასო';
    else if (!/[0-9]/.test(pw))
      this.errors2.password = 'მინიმუმ ერთი ციფრი';

    if (!this.step2.confirmPassword)
      this.errors2.confirmPassword = 'გაიმეორეთ პაროლი';
    else if (this.step2.password !== this.step2.confirmPassword)
      this.errors2.confirmPassword = 'პაროლები არ ემთხვევა';

    return Object.keys(this.errors2).length === 0;
  }

  get passwordStrength(): PasswordStrength {
    const p = this.step2.password;
    if (!p) return { score: 0, label: '', color: '' };

    let score = 0;
    if (p.length >= 8)          score++;
    if (p.length >= 12)         score++;
    if (/[A-Z]/.test(p))        score++;
    if (/[0-9]/.test(p))        score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;

    if (score <= 2) return { score, label: 'სუსტი',   color: '#ef4444' };
    if (score <= 3) return { score, label: 'საშუალო', color: '#f59e0b' };
    return              { score, label: 'ძლიერი',  color: '#22c55e' };
  }

  get passwordStrengthPercent(): number {
    return (this.passwordStrength.score / 5) * 100;
  }

  goNext(): void {
    if (this.validateStep1()) this.currentStep = 2;
  }

  goBack(): void {
    if (this.currentStep === 2) {
      this.currentStep = 1;
      this.errors2 = {};
    } else if (this.currentStep === 3) {
      this.currentStep = 2;
      this.verifyError = '';
      this.verificationCode = ['', '', '', '', '', ''];
    }
  }

  close(): void { this.closed.emit(); }

  // ✅ გამოსწორებული submit() finalize-ის მხარდაჭერით
  submit(): void {
    if (!this.validateStep2()) return;
    this.isLoading = true;
    console.log('🚀 Submit clicked - loading started');

    const payload = {
      company: { ...this.step1 },
      contact: {
        phone: this.step2.phone.trim().replace(/\s/g, ''),
        email: this.step2.email.trim().toLowerCase()
      },
      password: this.step2.password
    };

    console.log('📤 Sending payload:', payload);

    this.authService.registerCompany(payload).pipe(
      timeout(15000), // 15 წამის timeout
      finalize(() => {
        console.log('🔚 Observable finalized - loading should stop');
        this.isLoading = false; // ✅ ეს ყოველთვის ხმელდება!
      })
    ).subscribe({
      next: (res) => {
        console.log('✅ NEXT called with response:', res);
        this.registeredEmail = res.email;
        this.currentStep     = 3;
        this.startResendCooldown();
        console.log('✓ Moved to Step 3');
      },
      error: (err: any) => {
        console.error('❌ ERROR callback:', err);
        this.errors2.email = err.message || 'რეგისტრაციის შეცდომა';
      }
    });
  }

  onCodeInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const val   = input.value.replace(/\D/g, '');

    this.verificationCode[index] = val ? val[val.length - 1] : '';
    this.verifyError = '';

    if (val && index < 5) {
      (document.getElementById(`vc-${index + 1}`) as HTMLInputElement)?.focus();
    }
    if (this.fullCode.length === 6) this.verifyCode();
  }

  onCodeKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.verificationCode[index] && index > 0) {
      (document.getElementById(`vc-${index - 1}`) as HTMLInputElement)?.focus();
    }
  }

  onCodePaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text').replace(/\D/g, '') ?? '';
    if (text.length === 6) {
      this.verificationCode = text.split('');
      (document.getElementById('vc-5') as HTMLInputElement)?.focus();
      this.verifyCode();
    }
  }

  get fullCode(): string { return this.verificationCode.join(''); }

  verifyCode(): void {
    if (this.fullCode.length !== 6 || this.isLoading) return;
    this.isLoading   = true;
    this.verifyError = '';

    console.log('Verifying code for email:', this.registeredEmail);

    this.authService.verifyCompanyEmail({
      email: this.registeredEmail,
      code:  this.fullCode
    }).pipe(
      timeout(15000),
      finalize(() => { this.isLoading = false; })
    ).subscribe({
      next: (res: VerifyResponse) => {
        console.log('✓ Verification successful');

        const fullProfile: CompanyProfile = {
          ...res.company,
          email: this.step2.email.trim().toLowerCase(),
          phone: this.step2.phone.trim().replace(/\s/g, '')
        };

        this.authState.setSession(res.token, fullProfile);
        this.closed.emit();
        this.router.navigate(['/company/profile']);
      },
      error: (err: any) => {
        console.error('Verification error:', err);
        this.verifyError      = err.message || 'კოდი არ სწორია ან ვადა გასულია';
        this.verificationCode = ['', '', '', '', '', ''];
        setTimeout(() =>
          (document.getElementById('vc-0') as HTMLInputElement)?.focus(), 50);
      }
    });
  }

  resendCode(): void {
    if (this.resendCooldown > 0 || this.isLoading) return;
    this.isLoading = true;

    console.log('Resending code to:', this.registeredEmail);

    this.authService.resendCompanyCode({ email: this.registeredEmail }).pipe(
      timeout(15000),
      finalize(() => { this.isLoading = false; })
    ).subscribe({
      next:  () => {
        console.log('✓ Code resent');
        this.startResendCooldown();
      },
      error: (err) => {
        console.error('Resend error:', err);
        this.verifyError = err.message || 'კოდის გაგზავნის შეცდომა';
      }
    });
  }

  private startResendCooldown(): void {
    this.resendCooldown = 60;
    clearInterval(this.resendTimer);
    this.resendTimer = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) clearInterval(this.resendTimer);
    }, 1000);
  }

  onIdCodeInput(): void {
    this.step1.identificationCode = this.step1.identificationCode.replace(/\D/g, '');
    this.errors1.identificationCode = undefined;
  }

  clearError(field: string, step: 1 | 2): void {
    if (step === 1) this.errors1 = { ...this.errors1, [field]: undefined };
    else            this.errors2 = { ...this.errors2, [field]: undefined };
  }
}