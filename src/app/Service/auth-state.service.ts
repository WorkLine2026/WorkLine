import { Injectable, signal, computed } from '@angular/core';
import { CompanyProfile } from '../Models/company-registration.model';

const TOKEN_KEY = 'wl_token';
const USER_KEY  = 'wl_company';

@Injectable({ providedIn: 'root' })
export class AuthStateService {

  // ─── Signals ────────────────────────────────────────────────────────────────
  private _token   = signal<string | null>(this.loadToken());
  private _company = signal<CompanyProfile | null>(this.loadCompany());

  readonly token      = this._token.asReadonly();
  readonly company    = this._company.asReadonly();
  readonly isLoggedIn = computed(() => !!this._token());

  // ─── Persist after successful verify ────────────────────────────────────────
  setSession(token: string, company: CompanyProfile): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(company));
    this._token.set(token);
    this._company.set(company);
  }

  // ─── Clear on logout ────────────────────────────────────────────────────────
  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._token.set(null);
    this._company.set(null);
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  private loadToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private loadCompany(): CompanyProfile | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw) as CompanyProfile; }
    catch { return null; }
  }
}