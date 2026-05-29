import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
}

export interface DashboardStats {
  totalUsers: number;
  totalCompanies: number;
  activeJobs: number;
  pendingVerifications: number;
  newUsersThisWeek: number;
  newCompaniesThisWeek: number;
  totalWorkers: number;
}

export interface UserRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sector: string;
  city: string;
  isVerified: boolean;
  registeredAt: string;
  status: 'active' | 'suspended' | 'pending';
}

export interface CompanyRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  sector: string;
  city: string;
  identificationCode: string;
  isVerified: boolean;
  registeredAt: string;
  status: 'active' | 'suspended' | 'pending';
}

export interface WorkerRow {
  _id: string;
  fname: string;
  lname: string;
  city: string;
  sectors: string[];
  exp: string;
  avail: string;
  salary: string;
  phone: string;
  email: string;
  langs: string[];
  medbook: string;
}

export interface ActivityItem {
  icon: string;
  text: string;
  time: string;
  type: 'user' | 'company' | 'verify' | 'suspend';
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly api = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getAdminProfile(): Observable<AdminUser> {
    return this.http.get<AdminUser>(`${this.api}/profile`);
  }

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.api}/stats`);
  }

  getUsers(): Observable<UserRow[]> {
    return this.http.get<UserRow[]>(`${this.api}/users`);
  }

  getCompanies(): Observable<CompanyRow[]> {
    return this.http.get<CompanyRow[]>(`${this.api}/companies`);
  }

  getWorkers(): Observable<WorkerRow[]> {
    return this.http.get<WorkerRow[]>(`${this.api}/workers`);
  }

  deleteWorker(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/workers/${id}`);
  }

  getActivityFeed(): Observable<ActivityItem[]> {
    return this.http.get<ActivityItem[]>(`${this.api}/activity`);
  }

  verifyUser(userId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.api}/users/${userId}/verify`, {});
  }

  toggleUserStatus(userId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.api}/users/${userId}/toggle-status`, {});
  }

  deleteUser(userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/users/${userId}`);
  }

  verifyCompany(companyId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.api}/companies/${companyId}/verify`, {});
  }

  toggleCompanyStatus(companyId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.api}/companies/${companyId}/toggle-status`, {});
  }

  deleteCompany(companyId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/companies/${companyId}`);
  }

  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.api}/logout`, {});
  }
}