import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChooseRole } from '../choose-role/choose-role';
import { Registercompany } from '../registercompany/registercompany';
import { Registerperson } from '../registerperson/registerperson';
import { Login } from '../login-in/login-in';
import { Forgotpassword } from '../forgotpassword/forgotpassword';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, ChooseRole, Registercompany, Registerperson, Login, Forgotpassword],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit, OnDestroy {
  isScrolled = false;
  menuOpen = false;
  showChooseRole = false;
  showRegistration = false;
  showCompanyRegistration = false;
  showLoginin = false;
  showForgot = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkScroll();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
      document.body.style.width = '';
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.checkScroll();
  }

  private checkScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 20;
    }
  }

  toggleMenu(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.width = '100%';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }

  closeMenu(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.menuOpen) {
      this.menuOpen = false;
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }

  openLogin(): void {
    this.showLoginin = true;
    this.cdr.detectChanges();
  }

  openChooseRole(event?: Event): void {
    if (event) event.preventDefault();
    this.showChooseRole = true;
    this.cdr.detectChanges();
  }

  onRoleSelected(role: 'company' | 'worker'): void {
    if (role === 'company') {
      this.showCompanyRegistration = true;
    } else {
      this.showRegistration = true;
    }
    this.cdr.detectChanges();
  }
}