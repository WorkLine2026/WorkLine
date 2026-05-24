import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthStateService } from '../Service/auth-state.service';
import { CompanyProfile } from '../Models/company-registration.model';

@Component({
  selector: 'app-company-profile-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-profile-component.html',
  styleUrl: './company-profile-component.scss',
})
export class CompanyProfileComponent implements OnInit {
  company: CompanyProfile | null = null;
  profileImage: string | null = null;

  constructor(
    private authState: AuthStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.company = this.authState.company();
    const saved = localStorage.getItem('wl_profile_image');
    if (saved) this.profileImage = saved;
  }

  onImageUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.profileImage = reader.result as string;
      localStorage.setItem('wl_profile_image', this.profileImage);
    };
    reader.readAsDataURL(file);
  }

  logout(): void {
    this.authState.clearSession();
    this.router.navigate(['/']);
  }

  get initials(): string {
    return this.company?.name?.charAt(0).toUpperCase() ?? 'W';
  }
}