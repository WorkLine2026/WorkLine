import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, AuthUser } from '../../Service/auth.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog';
import { AuthStateService } from '../../Service/auth-state.service';

interface ActivityItem {
  type: 'apply' | 'view' | 'save' | 'msg';
  text: string;
  time: string;
}

interface CompletenessStep {
  label: string;
  done: boolean;
}

@Component({
  selector: 'app-person-profile',
  standalone: true,
  imports: [CommonModule, DatePipe, ConfirmDialogComponent],
  templateUrl: './person-profile.html',
  styleUrl: './person-profile.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PersonProfile implements OnInit {

   constructor(
    private authService: AuthService,
    private router: Router,
    private authState: AuthStateService
  ) {}
  showLogoutDialog = false;
  today = new Date();
  isOnline = true;

  // ── User data ──────────────────────────────────────────────────────────

  user: AuthUser & {
    sector:       string;
    experience:   string;
    availability: string;
    schedules:    string[];
    city:         string;
    phone:        string;
    birthDate:    string;
    gender:       string;
    idNumber:     string;
    isVerified:   boolean;
  } = {
    id:         '',
    firstName:  '',
    lastName:   '',
    email:      '',
    sector:     '',
    experience: '',
    availability: '',
    schedules:  [],
    city:       '',
    phone:      '',
    birthDate:  '',
    gender:     '',
    idNumber:   '',
    isVerified: false,
  };

  // ── Stats ──────────────────────────────────────────────────────────────

  stats = { views: 0, applications: 0, saved: 0, messages: 0 };

  // ── Completeness ───────────────────────────────────────────────────────

  completenessSteps: CompletenessStep[] = [];
  completeness = 0;

  // ── Activity ───────────────────────────────────────────────────────────

  recentActivity: ActivityItem[] = [];

  // ── Experience label map ───────────────────────────────────────────────

  private readonly expLabels: Record<string, string> = {
    none:   'გამოცდილება არ მაქვს',
    less1:  '1 წელზე ნაკლები',
    '1to3': '1–3 წელი',
    '3to5': '3–5 წელი',
    '5plus': '5+ წელი',
  };

  get experienceLabel(): string {
    return this.expLabels[this.user.experience] ?? this.user.experience;
  }

  get initials(): string {
    const f = this.user.firstName?.[0] ?? '';
    const l = this.user.lastName?.[0] ?? '';
    return (f + l).toUpperCase();
  }



  ngOnInit(): void {
    this.loadUserFromStorage();
    this.buildCompletenessSteps();
    this.loadMockData();
  }

  // ── Data loading ───────────────────────────────────────────────────────

private loadUserFromStorage(): void {
  const raw = localStorage.getItem('wl_user');
  if (!raw) { this.router.navigate(['/']); return; }
  try {
    const stored = JSON.parse(raw);
    this.user = { ...this.user, ...stored };
  } catch {
    this.router.navigate(['/']);
  }
}


  private buildCompletenessSteps(): void {
    const u = this.user;
    this.completenessSteps = [
      { label: 'პირადი ინფორმაცია',    done: !!(u.firstName && u.lastName && u.birthDate) },
      { label: 'სფერო და გამოცდილება',  done: !!(u.sector && u.experience) },
      { label: 'კონტაქტი',             done: !!(u.phone && u.email) },
      { label: 'ელ-ფოსტის ვერიფიკაცია', done: !!u.isVerified },
      { label: 'სამუშაო გრაფიკი',      done: !!(u.schedules && u.schedules.length) },
      { label: 'ხელმისაწვდომობა',       done: !!u.availability },
    ];

    const done = this.completenessSteps.filter(s => s.done).length;
    this.completeness = Math.round((done / this.completenessSteps.length) * 100);
  }

  private loadMockData(): void {
    // These would come from an API in production
    this.stats = { views: 24, applications: 3, saved: 7, messages: 1 };

    this.recentActivity = [
      { type: 'apply', text: 'განაცხადი გაგზავნეთ: მოლარე — SuperMarket',      time: '2 საათის წინ' },
      { type: 'view',  text: 'თქვენი პროფილი ნახეს: RestoCo',                   time: 'გუშინ' },
      { type: 'save',  text: 'შეინახეთ ვაკანსია: მიმტანი — CaféLux',           time: '3 დღის წინ' },
      { type: 'msg',   text: 'ახალი შეტყობინება: CleanPro',                     time: '4 დღის წინ' },
    ];
  }

  // ── Actions ────────────────────────────────────────────────────────────

  editProfile(): void {
    // Open edit modal or navigate to edit page
    console.log('Edit profile');
  }

  changePassword(): void {
    console.log('Change password');
  }

  deleteAccount(): void {
    const confirmed = confirm('დარწმუნებული ხართ? ეს მოქმედება შეუქცევადია.');
    if (!confirmed) return;
    this.authService.logout();
    this.router.navigate(['/']);

  }

  logout(): void {
    this.showLogoutDialog = true;
    this.authService.logout();
    this.router.navigate(['/']);
  }


  onLogoutResult(confirmed: boolean): void {
  this.showLogoutDialog = false;
  if (confirmed) {
    this.authState.clearSession();
    this.router.navigate(['/']);
  }}
}