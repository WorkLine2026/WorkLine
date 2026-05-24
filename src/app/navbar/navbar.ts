import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
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
  showForgot = false; // ← ახალი

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

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

  openChooseRole(event: Event): void {
    event.preventDefault();
    this.showChooseRole = true;
  }

  onRoleSelected(role: 'company' | 'worker') {
    if (role === 'company') {
      this.showCompanyRegistration = true;
    } else {
      this.showRegistration = true;
    }
  }
}