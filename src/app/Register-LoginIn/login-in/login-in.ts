import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../Service/auth.service';
import { AuthStateService } from '../../Service/auth-state.service';

@Component({
  selector: 'app-login-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-in.html',
  styleUrl: './login-in.scss',
  encapsulation: ViewEncapsulation.None
})
export class Login {
  @Output() closed            = new EventEmitter<void>();
  @Output() registerRequested = new EventEmitter<void>();
  @Output() forgotRequested   = new EventEmitter<void>();

  role: 'worker' | 'company' = 'worker';
  email            = '';
  password         = '';
  companyCode      = '';
  companyCodeError = '';
  loginError       = '';
  rememberMe       = false;
  showPassword     = false;
  submitted        = false;
  isLoading        = false;

  constructor(
    private router:      Router,
    private authService: AuthService,
    private authState:   AuthStateService
  ) {}

 submit(): void {
  this.submitted  = true;
  this.loginError = '';

  if (!this.email || !this.password) return;

  if (this.role === 'company' && !/^\d{9}$/.test(this.companyCode)) {
    this.companyCodeError = 'საიდენტიფიკაციო კოდი უნდა შეიცავდეს ზუსტად 9 ციფრს';
    return;
  }

  this.isLoading = true;

  if (this.role === 'worker') {
    this.authService.loginPerson(this.email.trim().toLowerCase(), this.password)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.closed.emit();
          this.router.navigate(['/person/profile']);
        },
        error: (err: Error) => {
          this.isLoading  = false;
          this.loginError = err.message;
        }
      });
  } else {
    this.authService.loginCompany({
      email:              this.email.trim().toLowerCase(),
      password:           this.password,
      identificationCode: this.companyCode
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.authState.setSession(res.token, res.company);
        this.closed.emit();
        this.router.navigate(['/company/profile']);
      },
      error: (err: Error) => {
        this.isLoading  = false;
        this.loginError = err.message;
      }
    });
  }
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