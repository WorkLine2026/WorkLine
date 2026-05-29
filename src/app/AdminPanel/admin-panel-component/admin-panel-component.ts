import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService, AdminUser, DashboardStats, UserRow, CompanyRow, WorkerRow, ActivityItem } from '../../Service/admin.service';

type ActiveSection = 'dashboard' | 'users' | 'companies' | 'workers' | 'settings';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel-component.html',
  styleUrl: './admin-panel-component.scss',
})
export class AdminPanelComponent implements OnInit {
  constructor(
    private adminService: AdminService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  activeSection: ActiveSection = 'dashboard';
  sidebarCollapsed = false;
  today = new Date();

  adminUser: AdminUser | null = null;
  stats: DashboardStats = {
    totalUsers: 0,
    totalCompanies: 0,
    activeJobs: 0,
    pendingVerifications: 0,
    newUsersThisWeek: 0,
    newCompaniesThisWeek: 0,
    totalWorkers: 0,
  };

  users: UserRow[] = [];
  userSearch = '';
  userStatusFilter: 'all' | 'active' | 'suspended' | 'pending' = 'all';

  companies: CompanyRow[] = [];
  companySearch = '';
  companyStatusFilter: 'all' | 'active' | 'suspended' | 'pending' = 'all';

  workers: WorkerRow[] = [];
  workerSearch = '';

  activityFeed: ActivityItem[] = [];

  get filteredUsers(): UserRow[] {
    return this.users.filter(u => {
      const matchSearch = !this.userSearch ||
        `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(this.userSearch.toLowerCase());
      const matchStatus = this.userStatusFilter === 'all' || u.status === this.userStatusFilter;
      return matchSearch && matchStatus;
    });
  }

  get filteredCompanies(): CompanyRow[] {
    return this.companies.filter(c => {
      const matchSearch = !this.companySearch ||
        `${c.name} ${c.email}`.toLowerCase().includes(this.companySearch.toLowerCase());
      const matchStatus = this.companyStatusFilter === 'all' || c.status === this.companyStatusFilter;
      return matchSearch && matchStatus;
    });
  }

  get filteredWorkers(): WorkerRow[] {
    return this.workers.filter(w =>
      !this.workerSearch ||
      `${w.fname} ${w.lname} ${w.city} ${w.sectors?.join(' ')}`.toLowerCase()
        .includes(this.workerSearch.toLowerCase())
    );
  }

  availLabel(v: string): string {
    const map: Record<string, string> = {
      asap: 'ახლავე მზად',
      week: 'ამ კვირაში',
      twoweeks: '2 კვირაში',
      month: '1 თვეში',
    };
    return map[v] || v;
  }

  ngOnInit(): void {
    this.loadAdminData();
  }

  setSection(section: ActiveSection): void {
    this.activeSection = section;
    if (section === 'workers' && this.workers.length === 0) {
      this.loadWorkers();
    }
    this.cdr.detectChanges();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.cdr.detectChanges();
  }

  loadAdminData(): void {
    this.adminService.getAdminProfile().subscribe({
      next: (user) => { this.adminUser = user; this.cdr.detectChanges(); },
      error: () => this.router.navigate(['/']),
    });
    this.adminService.getStats().subscribe((stats) => { this.stats = stats; this.cdr.detectChanges(); });
    this.adminService.getUsers().subscribe((users) => { this.users = users; this.cdr.detectChanges(); });
    this.adminService.getCompanies().subscribe((companies) => { this.companies = companies; this.cdr.detectChanges(); });
    this.adminService.getActivityFeed().subscribe((feed) => { this.activityFeed = feed; this.cdr.detectChanges(); });
  }

  loadWorkers(): void {
    this.adminService.getWorkers().subscribe({
      next: (workers) => { this.workers = workers; this.cdr.detectChanges(); },
      error: (err) => console.error('Workers ჩატვირთვა ჩავარდა:', err),
    });
  }

  deleteWorker(worker: WorkerRow): void {
    const id = worker._id;
    if (!id) return;
    this.adminService.deleteWorker(id).subscribe({
      next: () => {
        this.workers = this.workers.filter(w => w._id !== id);
        this.refreshStats();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('წაშლა ჩავარდა:', err),
    });
  }

  // ── USER ACTIONS ──────────────────────────────────────────────────

  toggleUserStatus(user: UserRow): void {
    const userId = user.id || (user as any)._id;
    if (!userId) return;
    const oldStatus = user.status;
    user.status = user.status === 'active' ? 'suspended' : 'active';
    this.cdr.detectChanges();
    this.adminService.toggleUserStatus(userId).subscribe({
      next: () => this.refreshStats(),
      error: (err) => { user.status = oldStatus; this.cdr.detectChanges(); console.error(err); }
    });
  }

  verifyUser(user: UserRow): void {
    const userId = user.id || (user as any)._id;
    if (!userId) return;
    this.adminService.verifyUser(userId).subscribe({
      next: () => { user.isVerified = true; user.status = 'active'; this.refreshStats(); this.cdr.detectChanges(); },
      error: (err) => console.error(err)
    });
  }

  deleteUser(user: UserRow): void {
    const userId = user.id || (user as any)._id;
    if (!userId) return;
    this.adminService.deleteUser(userId).subscribe({
      next: () => { this.users = this.users.filter(u => (u.id || (u as any)._id) !== userId); this.refreshStats(); this.cdr.detectChanges(); },
      error: (err) => console.error(err)
    });
  }

  // ── COMPANY ACTIONS ───────────────────────────────────────────────

  toggleCompanyStatus(company: CompanyRow): void {
    const companyId = company.id || (company as any)._id;
    if (!companyId) return;
    const oldStatus = company.status;
    company.status = company.status === 'active' ? 'suspended' : 'active';
    this.cdr.detectChanges();
    this.adminService.toggleCompanyStatus(companyId).subscribe({
      next: () => this.refreshStats(),
      error: (err) => { company.status = oldStatus; this.cdr.detectChanges(); console.error(err); }
    });
  }

  verifyCompany(company: CompanyRow): void {
    const companyId = company.id || (company as any)._id;
    if (!companyId) return;
    this.adminService.verifyCompany(companyId).subscribe({
      next: () => { company.isVerified = true; company.status = 'active'; this.refreshStats(); this.cdr.detectChanges(); },
      error: (err) => console.error(err)
    });
  }

  deleteCompany(company: CompanyRow): void {
    const companyId = company.id || (company as any)._id;
    if (!companyId) return;
    this.adminService.deleteCompany(companyId).subscribe({
      next: () => { this.companies = this.companies.filter(c => (c.id || (c as any)._id) !== companyId); this.refreshStats(); this.cdr.detectChanges(); },
      error: (err) => console.error(err)
    });
  }

  refreshStats(): void {
    this.adminService.getStats().subscribe((stats) => { this.stats = stats; this.cdr.detectChanges(); });
  }

  logout(): void {
    this.adminService.logout().subscribe({
      next: () => { localStorage.removeItem('wl_admin_token'); this.router.navigate(['/']); },
      error: () => { localStorage.removeItem('wl_admin_token'); this.router.navigate(['/']); },
    });
  }
}