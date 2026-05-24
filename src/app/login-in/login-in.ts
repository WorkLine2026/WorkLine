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
  @Output() forgotRequested = new EventEmitter<void>(); // ← ახალი

  role: 'worker' | 'company' = 'worker';
  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  submitted = false;

  submit(): void {
    this.submitted = true;
    if (!this.email || !this.password) return;
    console.log('Login:', { role: this.role, email: this.email, rememberMe: this.rememberMe });
    this.close();
  }

  onForgotPassword(): void {
    this.forgotRequested.emit(); // ← navbar-ს ეუბნება გახსნას
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