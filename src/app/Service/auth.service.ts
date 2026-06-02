import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import {
  RegisterPayload,
  RegisterResponse,
  VerifyPayload,
  VerifyResponse,
  ResendPayload,
  ResendResponse,
} from '../Models/company-registration.model';

// ── Person types ──────────────────────────────────────────────
export interface PersonRegisterPayload {
  // Step 1
  firstName:    string;
  lastName:     string;
  birthDate:    string;
  gender:       string;
  idNumber:     string;
  city:         string;
  // Step 2
  sector:       string;
  experience:   string;
  availability: string;
  schedules:    string[];
  // Step 3
  phone:        string;
  email:        string;
  password:     string;
}

export interface PersonVerifyPayload {
  email: string;
  code:  string;
}

export interface AuthUser {
  id:        string;
  firstName: string;
  lastName:  string;
  email:     string;
}

export interface PersonAuthResponse {
  message?: string;
  token:    string;
  user:     AuthUser;
}

// ─────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly companyApi = `${environment.apiUrl}/auth`;
  private readonly personApi  = `${environment.apiUrl}/auth/person`;

  constructor(private http: HttpClient) {}

  // ── Company ───────────────────────────────────────────────

  registerCompany(payload: RegisterPayload): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(`${this.companyApi}/register`, payload)
      .pipe(catchError(this.handleError));
  }

  verifyCompanyEmail(payload: VerifyPayload): Observable<VerifyResponse> {
    return this.http
      .post<VerifyResponse>(`${this.companyApi}/verify`, payload)
      .pipe(catchError(this.handleError));
  }

  resendCompanyCode(payload: ResendPayload): Observable<ResendResponse> {
    return this.http
      .post<ResendResponse>(`${this.companyApi}/resend`, payload)
      .pipe(catchError(this.handleError));
  }

  loginCompany(payload: {
    email:               string;
    password:            string;
    identificationCode?: string;
  }): Observable<VerifyResponse> {
    return this.http
      .post<VerifyResponse>(`${this.companyApi}/login`, payload)
      .pipe(catchError(this.handleError));
  }

  // ── Person ────────────────────────────────────────────────

  /**
   * ✓ იპირი რეგისტრაცია - ფაილობს გაგზავნას ელ-ფოსტის კოდი
   */
  registerPerson(payload: PersonRegisterPayload): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.personApi}/register`, payload)
      .pipe(catchError(this.handleError));
  }

  /**
   * ✓ მეილის ვერიფიკაცია OTP-ით
   */
  verifyPersonEmail(payload: PersonVerifyPayload): Observable<PersonAuthResponse> {
    return this.http
      .post<PersonAuthResponse>(`${this.personApi}/verify-email`, payload)
      .pipe(
        tap(res => this.savePersonSession(res)),
        catchError(this.handleError),
      );
  }

  /**
   * ✓ კოდის ხელახლა გაგზავნა
   */
  resendPersonCode(email: string): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.personApi}/resend-code`, { email })
      .pipe(catchError(this.handleError));
  }

  /**
   * ✓ იპირი ლოგინი
   */
  loginPerson(email: string, password: string): Observable<PersonAuthResponse> {
    return this.http
      .post<PersonAuthResponse>(`${this.personApi}/login`, { email, password })
      .pipe(
        tap(res => this.savePersonSession(res)),
        catchError(this.handleError),
      );
  }

  // ── Session helpers ───────────────────────────────────────

  /**
   * ✓ სესიის შენახვა localStorage-ში
   */
  private savePersonSession(res: PersonAuthResponse): void {
    localStorage.setItem('wl_token', res.token);
    localStorage.setItem('wl_user',  JSON.stringify(res.user));
  }

  /**
   * ✓ ტოკენის მიღება
   */
  getToken(): string | null {
    return localStorage.getItem('wl_token');
  }

  /**
   * ✓ დამოწმება: ჩვეულებრივი ისწავლის?
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * ✓ გამოსვლა / თხოვნის გასუფთავება
   */
  logout(): void {
    localStorage.removeItem('wl_token');
    localStorage.removeItem('wl_user');
  }

  // ── Error handler ─────────────────────────────────────────

  /**
   * ✓ შეცდომების მართვა HTTP მოთხოვნებისთვის
   */
  private handleError(err: HttpErrorResponse): Observable<never> {
    const message =
      err.error?.message ||
      err.error?.error ||
      (err.status === 0
        ? 'სერვერთან კავშირი ვერ დამყარდა'
        : `სერვერის შეცდომა (${err.status})`);
    return throwError(() => new Error(message));
  }
}