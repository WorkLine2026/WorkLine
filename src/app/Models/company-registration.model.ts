// ─── Step 1 ──────────────────────────────────────────────────────────────────

export interface CompanyInfo {
  name: string;
  identificationCode: string;
  sector: string;
  city: string;
}

// ─── Step 2 (form only) ──────────────────────────────────────────────────────

export interface ContactInfo {
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ─── გაერთიანებული პროფილი ───────────────────────────────────────────────────

export interface CompanyProfile extends CompanyInfo {
  email: string;
  phone: string;
}

// ─── API Payloads ─────────────────────────────────────────────────────────────

export interface ContactPayload {
  phone: string;
  email: string;
}

export interface RegisterPayload {
  company: CompanyInfo;
  contact: ContactPayload;
  password: string;
}

export interface VerifyPayload {
  email: string;
  code: string;
}

export interface ResendPayload {
  email: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface RegisterResponse {
  message: string;
  email: string;
}

export interface VerifyResponse {
  message: string;
  token: string;
  company: CompanyProfile;
}

export interface ResendResponse {
  message: string;
}

// ─── Password strength ────────────────────────────────────────────────────────

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}