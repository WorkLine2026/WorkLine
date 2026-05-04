import { Component } from '@angular/core';

interface IFormData {
  companyName: string;
  contactPerson: string;
  phone: string;
  position: string;
  duration: string;
  message: string;
}

interface CounterConfig {
  el: HTMLElement;
  target: number;
  start: number;
}

@Component({
  selector: 'app-forbusisness',
  imports: [],
  templateUrl: './forbusisness.html',
  styleUrls: ['./forbusisness.scss']  
})
export class Forbusisness {
  // Component properties and lifecycle
  title = 'WorkLine Business';

  ngOnInit() {
    this.initBusinessPage();
  }

  private initBusinessPage(): void {
    // Initialize all features after view init
    setTimeout(() => {
      this.initNav();
      this.initCounters();
      this.initScrollReveal();
      this.initFAQ();
      this.initContactForm();
      this.initHeroParallax();
      this.addShakeAnimation();
    }, 100);
  }

  // ============================================
  // NAV — scroll behavior + mobile menu
  // ============================================
  private initNav(): void {
    const nav = document.getElementById('nav');
    const burger = document.getElementById('navBurger');
    const mobile = document.getElementById('navMobile');

    if (!nav || !burger || !mobile) return;

    const updateNavScroll = () => {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', updateNavScroll, { passive: true });
    updateNavScroll();

    // Mobile menu toggle
    let isOpen = false;
    burger.addEventListener('click', () => {
      isOpen = !isOpen;
      mobile.classList.toggle('open', isOpen);
      
      const spans = burger.querySelectorAll('span');
      if (spans.length === 3) {
        spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
        spans[1].style.opacity = isOpen ? '0' : '';
        spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
      }
    });

    // Close on outside click
    document.addEventListener('click', (e: MouseEvent) => {
      if (isOpen && !nav.contains(e.target as Node)) {
        mobile.classList.remove('open');
        isOpen = false;
        const spans = burger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Smooth scroll links
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e: MouseEvent) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector<HTMLElement>(href);
        if (!target) return;

        e.preventDefault();
        const navHeight = nav.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  // ============================================
  // COUNTER ANIMATOR
  // ============================================
  private initCounters(): void {
    const elements = document.querySelectorAll<HTMLElement>('[data-target]');
    if (elements.length === 0) return;

    const configs: CounterConfig[] = [];
    elements.forEach(el => {
      const target = parseInt(el.getAttribute('data-target') || '0', 10);
      configs.push({ el, target, start: 0 });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          configs.forEach(config => this.animateCounter(config));
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    const heroMetrics = document.querySelector('.hero__metrics');
    if (heroMetrics) observer.observe(heroMetrics);
  }

  private animateCounter(config: CounterConfig): void {
    const duration = 1800;
    const startTime = performance.now();

    const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

    const tick = (now: number): void => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = Math.round(config.start + (config.target - config.start) * eased);

      config.el.textContent = current.toString();

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }

  // ============================================
  // SCROLL REVEAL
  // ============================================
  private initScrollReveal(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    const selectors = [
      '.pain-card', '.how-step', '.sector-card', 
      '.pricing-card', '.testi-card', '.faq-item',
      '.channel-link', '.section-header'
    ];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach((el, i) => {
        (el as HTMLElement).style.transitionDelay = `${i * 0.06}s`;
        el.classList.add('reveal-up');
        observer.observe(el);
      });
    });
  }

  // ============================================
  // FAQ ACCORDION
  // ============================================
  private initFAQ(): void {
    const items = document.querySelectorAll<HTMLElement>('.faq-item');
    items.forEach(item => {
      const btn = item.querySelector<HTMLButtonElement>('.faq-item__q');
      if (!btn) return;

      btn.addEventListener('click', () => {
        const isOpen = item.getAttribute('data-open') === 'true';
        items.forEach(i => i.setAttribute('data-open', 'false'));
        item.setAttribute('data-open', isOpen ? 'false' : 'true');
      });
    });
  }

  // ============================================
  // CONTACT FORM
  // ============================================
  private initContactForm(): void {
    const form = document.getElementById('contactForm') as HTMLElement;
    const success = document.getElementById('contactSuccess') as HTMLElement;
    const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;

    if (!form || !success || !submitBtn) return;

    submitBtn.addEventListener('click', () => this.handleFormSubmit(form, success, submitBtn));

    // Real-time validation
    const inputs = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      'input, textarea, select'
    );
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
    });
  }

  private handleFormSubmit(form: HTMLElement, success: HTMLElement, submitBtn: HTMLButtonElement): void {
    const data = this.getFormData();
    const errors = this.validateForm(data);

    if (errors.length > 0) {
      this.highlightFormErrors(errors);
      this.shakeElement(submitBtn);
      return;
    }

    submitBtn.textContent = 'იგზავნება...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      form.style.display = 'none';
      success.style.display = 'flex';
      success.style.flexDirection = 'column';
      success.style.alignItems = 'center';
      success.style.justifyContent = 'center';
      
      console.log('Form submitted:', data);
      submitBtn.textContent = 'გაგზავნილია';
    }, 1200);
  }

  private getFormData(): IFormData {
    return {
      companyName: (document.getElementById('companyName') as HTMLInputElement)?.value?.trim() || '',
      contactPerson: (document.getElementById('contactPerson') as HTMLInputElement)?.value?.trim() || '',
      phone: (document.getElementById('phone') as HTMLInputElement)?.value?.trim() || '',
      position: (document.getElementById('position') as HTMLInputElement)?.value?.trim() || '',
      duration: (document.getElementById('duration') as HTMLSelectElement)?.value || '',
      message: (document.getElementById('message') as HTMLTextAreaElement)?.value?.trim() || '',
    };
  }

  private validateForm(data: IFormData): string[] {
    const errors: string[] = [];
    if (!data.companyName) errors.push('companyName');
    if (!data.contactPerson) errors.push('contactPerson');
    if (!data.phone || data.phone.length < 9) errors.push('phone');
    return errors;
  }

  private validateField(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): void {
    const required = ['companyName', 'contactPerson', 'phone'];
    if (!required.includes(el.id)) return;

    const isEmpty = !el.value.trim();
    const isPhone = el.id === 'phone' && el.value.trim().length < 9;

    if (isEmpty || isPhone) {
      el.style.borderColor = 'rgba(224, 82, 82, 0.5)';
    } else {
      el.style.borderColor = 'rgba(47, 184, 126, 0.4)';
    }
  }

  private highlightFormErrors(errorFields: string[]): void {
    errorFields.forEach(id => {
      const el = document.getElementById(id) as HTMLInputElement;
      if (el) {
        el.style.borderColor = 'rgba(224, 82, 82, 0.5)';
        el.focus();
      }
    });
  }

  private shakeElement(el: HTMLElement): void {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'shake 0.4s ease';
    setTimeout(() => { el.style.animation = ''; }, 400);
  }

  // ============================================
  // HERO PARALLAX
  // ============================================
  private initHeroParallax(): void {
    const orb1 = document.querySelector<HTMLElement>('.hero__orb--1');
    const orb2 = document.querySelector<HTMLElement>('.hero__orb--2');

    if (!orb1 && !orb2) return;

    const onMouseMove = (e: MouseEvent): void => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      if (orb1) orb1.style.transform = `translate(${x * 15}px, ${y * 10}px)`;
      if (orb2) orb2.style.transform = `translate(${x * -10}px, ${y * -8}px)`;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
  }

  // ============================================
  // UTILITIES
  // ============================================
  private addShakeAnimation(): void {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-6px); }
        40% { transform: translateX(6px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
      }
    `;
    document.head.appendChild(style);
  }
}