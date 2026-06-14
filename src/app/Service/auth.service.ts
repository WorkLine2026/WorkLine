import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// ── Company Registration Models ────────────────────────────

export interface RegisterPayload {
  company: {
    name: string;
    identificationCode: string;
    sector: string;
    city: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  password: string;
}

export interface RegisterResponse {
  message?: string;
  phone: string;
  email: string;
}

export interface VerifyPayload {
  phone: string;
  code: string;
}

export interface VerifyResponse {
  token: string;
  company: {
    id: string;
    name: string;
    identificationCode: string;
    sector: string;
    city: string;
  };
}

export interface ResendPayload {
  phone: string;
}

export interface ResendResponse {
  message: string;
}

// ── Person Registration Models ─────────────────────────────

export interface PersonRegisterPayload {
  firstName:    string;
  lastName:     string;
  birthDate:    string;
  gender:       string;
  idNumber:     string;
  city:         string;
  sector:       string;
  experience:   string;
  availability: string;
  schedules:    string[];
  phone:        string;
  email:        string;
  password:     string;
}

export interface PersonRegisterResponse {
  message?: string;
  phone: string;      // ✅ ტელეფონი რომელზე გაიგზავნა OTP
  email: string;
}

export interface PersonVerifyPhonePayload {
  phone: string;
  code: string;
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

  /**
   * ✅ კომპანიის რეგისტრაცია
   * SMS კოდი მიიყოს ტელეფონზე
   */
  registerCompany(payload: RegisterPayload): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(`${this.companyApi}/register`, payload)
      .pipe(catchError(this.handleError));
  }

  /**
   * ✅ ტელეფონის დადასტურება OTP-ით (კომპანია)
   */
  verifyCompanyPhone(payload: VerifyPayload): Observable<VerifyResponse> {
    return this.http
      .post<VerifyResponse>(`${this.companyApi}/verify-phone`, payload)
      .pipe(catchError(this.handleError));
  }

  /**
   * ✅ კოდის ხელახლა გაგზავნა (კომპანია, ტელეფონზე)
   */
  resendCompanyCode(payload: ResendPayload): Observable<ResendResponse> {
    return this.http
      .post<ResendResponse>(`${this.companyApi}/resend-code`, payload)
      .pipe(catchError(this.handleError));
  }

  /**
   * ✅ კომპანიის ლოგინი
   */
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
   * ✓ იპირი რეგისტრაცია - SMS კოდი ტელეფონზე
   */
  registerPerson(payload: PersonRegisterPayload): Observable<PersonRegisterResponse> {
    return this.http
      .post<PersonRegisterResponse>(`${this.personApi}/register`, payload)
      .pipe(catchError(this.handleError));
  }

  /**
   * ✅ ტელეფონის დადასტურება OTP-ით (იპირი)
   */
  verifyPersonPhone(payload: PersonVerifyPhonePayload): Observable<PersonAuthResponse> {
    return this.http
      .post<PersonAuthResponse>(`${this.personApi}/verify-phone`, payload)
      .pipe(
        tap(res => this.savePersonSession(res)),
        catchError(this.handleError),
      );
  }

  /**
   * ✅ კოდის ხელახლა გაგზავნა (იპირი, ტელეფონზე)
   */
  resendPersonCode(phone: string): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.personApi}/resend-code`, { phone })
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
   * ✓ დამოწმება: ჩვეულებრივი მომხმარებელი დადებული?
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * ✓ გამოსვლა
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