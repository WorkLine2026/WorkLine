import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  RegisterPayload,
  RegisterResponse,
  VerifyPayload,
  VerifyResponse,
  ResendPayload,
  ResendResponse
} from '../Models/company-registration.model';

const API_BASE = `${environment.apiUrl}/auth`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  registerCompany(payload: RegisterPayload): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(`${API_BASE}/register`, payload)
      .pipe(catchError(this.handleError));
  }

  verifyEmail(payload: VerifyPayload): Observable<VerifyResponse> {
    return this.http
      .post<VerifyResponse>(`${API_BASE}/verify`, payload)
      .pipe(catchError(this.handleError));
  }

  resendCode(payload: ResendPayload): Observable<ResendResponse> {
    return this.http
      .post<ResendResponse>(`${API_BASE}/resend`, payload)
      .pipe(catchError(this.handleError));
  }

  loginCompany(payload: {
    email: string;
    password: string;
    identificationCode?: string;
  }): Observable<VerifyResponse> {
    return this.http
      .post<VerifyResponse>(`${API_BASE}/login`, payload)
      .pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const message =
      err.error?.message ||
      (err.status === 0
        ? 'სერვერთან კავშირი ვერ დამყარდა'
        : `სერვერის შეცდომა (${err.status})`);
    return throwError(() => new Error(message));
  }
}