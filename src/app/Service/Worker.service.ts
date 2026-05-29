import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface WorkerData {
  fname: string;
  lname: string;
  dob: string;
  gender: string;
  pid: string;
  city: string;
  phone: string;
  email: string;
  wa: string;
  fb: string;
  sectors: string[];
  exp: string;
  edu: string;
  langs: string[];
  computer: string[];
  bio: string;
  certs: string[];
  customCerts: string[];
  certFiles: string;
  restrictions: string[];
  medbook: string;
  healthNote: string;
  avail: string;
  schedule: string[];
  salary: string | number;
  cvNames: string;
}

export interface CreateWorkerResponse {
  success: boolean;
  message: string;
  workerId: string;
  data?: any;
}

export interface Worker {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  city: string;
  sectors: string[];
  exp: string;
  salary: number;
  status: 'pending' | 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class WorkerService {
  private readonly workersApi = `${environment.apiUrl}/workers`;

  constructor(private http: HttpClient) {}

  /**
   * Create new worker profile
   * POST /api/workers
   */
  createWorker(data: WorkerData): Observable<CreateWorkerResponse> {
    const payload = {
      fname: data.fname?.trim(),
      lname: data.lname?.trim(),
      dob: data.dob,
      gender: data.gender,
      pid: data.pid?.trim() || '',
      city: data.city,
      phone: data.phone?.trim(),
      email: data.email?.toLowerCase().trim(),
      wa: data.wa?.trim() || '',
      fb: data.fb?.trim() || '',
      sectors: Array.isArray(data.sectors) ? data.sectors : [data.sectors],
      exp: data.exp,
      edu: data.edu || '',
      langs: data.langs || ['ქართული'],
      computer: data.computer || [],
      bio: data.bio?.trim() || '',
      certs: data.certs || [],
      customCerts: data.customCerts || [],
      certFiles: data.certFiles || '',
      restrictions: data.restrictions || [],
      medbook: data.medbook || 'no',
      healthNote: data.healthNote?.trim() || '',
      avail: data.avail,
      schedule: data.schedule || [],
      salary: data.salary ? parseInt(String(data.salary), 10) : null,
      cvNames: data.cvNames || '',
    };

    // POST to /api/workers (not /api/workers/create)
    return this.http
      .post<CreateWorkerResponse>(`${this.workersApi}`, payload)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get worker by ID
   * GET /api/workers/:id
   */
  getWorker(id: string): Observable<Worker> {
    return this.http
      .get<Worker>(`${this.workersApi}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get all workers
   * GET /api/workers?page=1&limit=20&city=თბილისი
   */
  getAllWorkers(filters?: {
    page?: number;
    limit?: number;
    city?: string;
    sector?: string;
  }): Observable<{ success: boolean; total: number; data: Worker[] }> {
    let queryString = '';

    if (filters) {
      const params = new URLSearchParams();
      if (filters.page !== undefined) params.set('page', String(filters.page));
      if (filters.limit !== undefined) params.set('limit', String(filters.limit));
      if (filters.city) params.set('city', filters.city);
      if (filters.sector) params.set('sector', filters.sector);
      queryString = params.toString() ? `?${params.toString()}` : '';
    }

    return this.http
      .get<{ success: boolean; total: number; data: Worker[] }>(
        `${this.workersApi}${queryString}`
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Search workers
   * GET /api/workers/search?q=სახელი&city=თბილისი
   */
  searchWorkers(query?: {
    q?: string;
    sector?: string;
    city?: string;
    langs?: string[];
    exp?: string;
  }): Observable<{ success: boolean; count: number; data: Worker[] }> {
    let queryString = '';

    if (query) {
      const params = new URLSearchParams();
      if (query.q) params.set('q', query.q);
      if (query.sector) params.set('sectors', query.sector);
      if (query.city) params.set('city', query.city);
      if (query.exp) params.set('exp', query.exp);
      if (query.langs && query.langs.length) {
        query.langs.forEach(lang => params.append('langs', lang));
      }
      queryString = params.toString() ? `?${params.toString()}` : '';
    }

    return this.http
      .get<{ success: boolean; count: number; data: Worker[] }>(
        `${this.workersApi}/search${queryString}`
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Get workers by city
   * GET /api/workers/city/:city
   */
  getWorkersByCity(city: string): Observable<{ success: boolean; city: string; count: number; data: Worker[] }> {
    return this.http
      .get<{ success: boolean; city: string; count: number; data: Worker[] }>(
        `${this.workersApi}/city/${city}`
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Get statistics
   * GET /api/workers/stats
   */
  getStatistics(): Observable<any> {
    return this.http
      .get(`${this.workersApi}/stats`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update worker profile
   * PUT /api/workers/:id
   */
  updateWorker(
    id: string,
    updates: Partial<WorkerData>
  ): Observable<{ success: boolean; message: string; data: Worker }> {
    return this.http
      .put<{ success: boolean; message: string; data: Worker }>(
        `${this.workersApi}/${id}`,
        updates
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete worker
   * DELETE /api/workers/:id
   */
  deleteWorker(id: string): Observable<{ success: boolean; message: string }> {
    return this.http
      .delete<{ success: boolean; message: string }>(`${this.workersApi}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Error handler
   */
  private handleError(err: HttpErrorResponse): Observable<never> {
    let message = 'შეცდომა მოთხოვნის შესრულებისას';

    if (err.error?.error) {
      message = err.error.error;
    } else if (err.error?.message) {
      message = err.error.message;
    } else if (err.status === 0) {
      message = 'სერვერთან კავშირი ვერ დამყარდა';
    } else if (err.status === 400) {
      message = err.error?.errors?.[0]?.msg || 'მოუნებელი მონაცემები';
    } else if (err.status === 409) {
      message = 'ელ-ფოსტა ან ტელეფონი უკვე დარეგისტრირებულია';
    } else if (err.status === 404) {
      message = 'მოთხოვნილი რესურსი ვერ მოიძებნა';
    } else if (err.status === 500) {
      message = 'სერვერის შიდა შეცდომა';
    }

    console.error('🔴 Worker Service Error:', err);
    return throwError(() => ({
      error: message,
      status: err.status,
      originalError: err,
    }));
  }
}