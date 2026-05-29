import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss'
})
export class AdminLoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.loading = true;
    this.error = '';

    this.http.post<any>(`${environment.apiUrl}/admin/login`, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        localStorage.setItem('wl_admin_token', res.token);
        this.router.navigate(['/admin/panel']);
      },
      error: (err) => {
        this.error = err.error?.message || 'შეცდომა მოხდა';
        this.loading = false;
      }
    });
  }
}