import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-in',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-in.html',
  styleUrl: './login-in.scss',
  encapsulation: ViewEncapsulation.None
})
export class Login {
  @Output() closed = new EventEmitter<void>();
  @Output() registerRequested = new EventEmitter<void>();
  @Output() forgotRequested = new EventEmitter<void>();

  role: 'worker' | 'company' = 'worker';
  email = '';
  password = '';
  companyCode = '';
  companyCodeError = '';
  rememberMe = false;
  showPassword = false;
  submitted = false;

  submit(): void {
    this.submitted = true;
    if (!this.email || !this.password) return;
    if (this.role === 'company' && !/^\d{9}$/.test(this.companyCode)) {
      this.companyCodeError = 'საიდენტიფიკაციო კოდი უნდა შეიცავდეს ზუსტად 9 ციფრს';
      return;
    }
    console.log('Login:', { role: this.role, email: this.email, companyCode: this.companyCode, rememberMe: this.rememberMe });
    this.close();
  }

  onForgotPassword(): void {
    this.forgotRequested.emit();
    this.close();
  }

  onRegister(): void {
    this.registerRequested.emit();
    this.close();
  }

  close(): void {
    this.closed.emit();
  }
}