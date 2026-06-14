// ── Company Models ────────────────────────────────────────────

export interface CompanyInfo {
  name: string;
  identificationCode: string;
  sector: string;
  city: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export interface CompanyProfile {
  id?: string;
  name: string;
  identificationCode: string;
  sector: string;
  city: string;
  phone: string;
  email: string;
}

// ── API Payloads & Responses ──────────────────────────────────

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
  phone: string;      // ✅ ტელეფონი რომელზე გაიგზავნა OTP
  email: string;      // დამხმარე მეილი
}

/**
 * ✅ ტელეფონით OTP დადასტურება
 */
export interface VerifyPayload {
  phone: string;      // ✅ ტელეფონი
  code: string;       // 6-ნიშნა OTP კოდი
}

export interface VerifyResponse {
  message?: string;
  token: string;
  company: {
    id: string;
    name: string;
    identificationCode: string;
    sector: string;
    city: string;
  };
  email?: string;
  phone?: string;
}

/**
 * ✅ OTP კოდის ხელახლა გაგზავნა
 */
export interface ResendPayload {
  phone: string;      // ✅ ტელეფონი
}

export interface ResendResponse {
  message: string;
}