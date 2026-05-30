import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CompanyData } from '../Company and Person/iamcompany/iamcompany';

/**
 * ============================================
 * 📡 JobRequestService
 * ============================================
 * API მოთხოვნა backend-ისთვის
 * Base URL: ამოღებული environment.ts-დან
 */
@Injectable({
  providedIn: 'root'
})
export class JobRequestService {

  // ═════════════════════════════════════════
  // ✓ API URL (environment-დან)
  // ═════════════════════════════════════════
  private apiUrl = `${environment.apiUrl}/job-requests`;

  // ═════════════════════════════════════════
  // ✓ Constructor
  // ═════════════════════════════════════════
  constructor(private http: HttpClient) {}

  /**
   * ========================================
   * POST - კადრის კვეთის შეკვეთა
   * ========================================
   * @param data CompanyData - ფორმის მონაცემი
   * @returns Observable<any> - Server response
   */
  submitJobRequest(data: CompanyData): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  /**
   * ========================================
   * GET - ყველა Job Request
   * ========================================
   * @param page - გვერდი (default: 1)
   * @param limit - რეკორდების რაოდენობა (default: 10)
   * @param status - ფილტრი სტატუსით (pending, approved, rejected)
   * @param city - ფილტრი ქალაქით
   * @returns Observable<any>
   */
  getAllJobRequests(
    page: number = 1,
    limit: number = 10,
    status?: string,
    city?: string
  ): Observable<any> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('limit', limit.toString());

    if (status) {
      params = params.set('status', status);
    }
    if (city) {
      params = params.set('city', city);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  /**
   * ========================================
   * GET - ერთი Job Request ID-ით
   * ========================================
   * @param id - Request ID
   * @returns Observable<any>
   */
  getJobRequestById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * ========================================
   * PUT - Job Request-ის განახლება
   * ========================================
   * @param id - Request ID
   * @param status - ახალი სტატუსი
   * @param notes_admin - ადმინის შენიშვნა
   * @returns Observable<any>
   */
  updateJobRequest(
    id: string,
    status: string,
    notes_admin?: string
  ): Observable<any> {
    const body: any = { status };
    if (notes_admin) {
      body.notes_admin = notes_admin;
    }
    return this.http.put<any>(`${this.apiUrl}/${id}`, body);
  }

  /**
   * ========================================
   * DELETE - Job Request წაშლა
   * ========================================
   * @param id - Request ID
   * @returns Observable<any>
   */
  deleteJobRequest(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * ========================================
   * GET - სტატისტიკა
   * ========================================
   * @returns Observable<any> - Overview stats
   */
  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats/overview`);
  }

  /**
   * ========================================
   * GET - დღევანდელი კვეთები
   * ========================================
   * @returns Observable<any>
   */
  getTodayRequests(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats/today`);
  }

  /**
   * ========================================
   * GET - პენდინგი კვეთები
   * ========================================
   * @returns Observable<any>
   */
  getPendingRequests(limit: number = 5): Observable<any> {
    let params = new HttpParams();
    params = params.set('status', 'pending');
    params = params.set('limit', limit.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  /**
   * ========================================
   * GET - კვეთები ქალაქის მიხედვით
   * ========================================
   * @param city - ქალაქის სახელი
   * @returns Observable<any>
   */
  getRequestsByCity(city: string): Observable<any> {
    let params = new HttpParams();
    params = params.set('city', city);
    return this.http.get<any>(this.apiUrl, { params });
  }

  /**
   * ========================================
   * GET - კვეთები სექტორის მიხედვით
   * ========================================
   * @param sector - სექტორის სახელი
   * @returns Observable<any>
   */
  getRequestsBySector(sector: string): Observable<any> {
    let params = new HttpParams();
    params = params.set('sector', sector);
    return this.http.get<any>(this.apiUrl, { params });
  }

  /**
   * ========================================
   * POST - CSV Export
   * ========================================
   * @param filters - ფილტრები
   * @returns Observable<any>
   */
  exportToCSV(filters?: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/export/csv`, filters || {});
  }

  /**
   * ========================================
   * POST - PDF Export
   * ========================================
   * @param id - Request ID
   * @returns Observable<any>
   */
  exportToPDF(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/export/pdf`, {});
  }
}