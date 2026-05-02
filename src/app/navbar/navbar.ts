import { CommonModule } from '@angular/common';
import { Component,HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  isScrolled = false;
  menuOpen = false;
 
  ngOnInit(): void {
    this.checkScroll();
  }
 
  ngOnDestroy(): void {
    // component destroy-ზე body სუფთა იყოს
    document.body.style.overflow = '';
    document.body.style.width = '';
  }
 
  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.checkScroll();
  }
 
  private checkScroll(): void {
    this.isScrolled = window.scrollY > 20;
  }
 
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      // scroll ვბლოკავთ — position:fixed body-ზე scrollbar-ის გარეშე
      document.body.style.overflow = 'hidden';
      document.body.style.width = '100%';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      // ვაბრუნებთ scroll-ს და პოზიციას
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }
 
  closeMenu(): void {
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
}
