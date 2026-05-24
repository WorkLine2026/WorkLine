import { Component, EventEmitter, OnDestroy, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgotpassword',
  imports: [CommonModule, FormsModule],
  templateUrl: './forgotpassword.html',
  styleUrl: './forgotpassword.scss',
  encapsulation: ViewEncapsulation.None
})
export class Forgotpassword implements OnDestroy {
  @Output() closed = new EventEmitter<void>();
  @Output() backToLogin = new EventEmitter<void>();

  currentStep = 1;
  submitted = false;

  stepTitles = ['პაროლის აღდგენა', 'კოდის შეყვანა', 'ახალი პაროლი'];
  stepSubs = [
    'შეიყვანეთ თქვენი ელ-ფოსტა და გამოგიგზავნით კოდს',
    'შეიყვანეთ ელ-ფოსტაზე მიღებული 6-ნიშნა კოდი',
    'შექმენით ახალი პაროლი თქვენი ანგარიშისთვის'
  ];

  // Step 1
  email = '';

  // Step 2
  otp: string[] = ['', '', '', '', '', ''];
  resendTimer = 60;
  private timerInterval: any;

  // Step 3
  newPassword = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;

  get passwordStrength(): number {
    const p = this.newPassword;
    if (!p || p.length < 6) return 1;
    const hasUpper = /[A-Z]/.test(p);
    const hasNum = /[0-9]/.test(p);
    const hasSpecial = /[^A-Za-z0-9]/.test(p);
    const score = (hasUpper ? 1 : 0) + (hasNum ? 1 : 0) + (hasSpecial ? 1 : 0);
    if (p.length >= 8 && score >= 2) return 3;
    if (p.length >= 6 && score >= 1) return 2;
    return 1;
  }

  sendCode(): void {
    this.submitted = true;
    if (!this.email) return;
    this.submitted = false;
    this.currentStep = 2;
    this.startTimer();
  }

  verifyCode(): void {
    this.submitted = true;
    if (!this.isOtpFull()) return;
    this.submitted = false;
    this.currentStep = 3;
    this.stopTimer();
  }

  resetPassword(): void {
    this.submitted = true;
    if (!this.newPassword || this.newPassword !== this.confirmPassword) return;
    console.log('Password reset for:', this.email);
    this.close();
  }

  isOtpFull(): boolean {
    return this.otp.every(d => d !== '');
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/\D/g, '');
    this.otp[index] = val;
    input.value = val;

    if (val && index < 5) {
      const next = input.parentElement?.querySelectorAll('.fp-otp-input')[index + 1] as HTMLInputElement;
      next?.focus();
    }
  }

  onOtpKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otp[index] && index > 0) {
      const input = event.target as HTMLInputElement;
      const prev = input.parentElement?.querySelectorAll('.fp-otp-input')[index - 1] as HTMLInputElement;
      prev?.focus();
    }
  }

  resendCode(): void {
    this.otp = ['', '', '', '', '', ''];
    this.startTimer();
    console.log('Resend code to:', this.email);
  }

  private startTimer(): void {
    this.stopTimer();
    this.resendTimer = 60;
    this.timerInterval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) this.stopTimer();
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  goBack(): void {
    this.currentStep--;
    this.submitted = false;
    if (this.currentStep < 2) this.stopTimer();
  }

  onBackToLogin(): void {
    this.backToLogin.emit();
    this.close();
  }

  close(): void {
    this.stopTimer();
    this.closed.emit();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }
}