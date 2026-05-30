import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JobRequestService } from '../../Service/job-request.service';

/**
 * ============================================
 * CompanyData Interface
 * ============================================
 * ფორმის ყველა მონაცემის ტიპი
 */
export interface CompanyData {
  companyName: string;
  sector: string;
  companySize: string;
  contactName: string;
  contactRole: string;
  phone: string;
  email: string;
  taxId: string;
  positions: string[];
  headcount: string;
  expRequired: string;
  langs: string[];
  certsRequired: string[];
  requirements: string;
  duration: string;
  schedule: string[];
  salaryFrom: string;
  salaryTo: string;
  payType: string;
  benefits: string[];
  city: string;
  district: string;
  address: string;
  startDate: string;
  specificDate: string;
  workEnv: string;
  notes: string;
  agreed: boolean;
}

/**
 * ============================================
 * Iamcompany Component
 * ============================================
 * კომპანიის მიერ კადრის კვეთის ფორმა (5-ნაბიჯი)
 */
@Component({
  selector: 'app-iamcompany',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './iamcompany.html',
  styleUrl: './iamcompany.scss',
})
export class Iamcompany implements OnDestroy {

  @Output() closed = new EventEmitter<void>();

  // ═════════════════════════════════════════
  // ✓ ძირითადი ცვლადები
  // ═════════════════════════════════════════
  currentStep = 0;
  totalSteps = 5;
  direction: 'forward' | 'back' = 'forward';
  submitted = false;
  shakeNext = false;
  isLoading = false;
  data: CompanyData = this.emptyData();
  errors: Record<string, boolean> = {};

  // ═════════════════════════════════════════
  // ✓ ნაბიჯების ლეიბელები
  // ═════════════════════════════════════════
  stepLabels = [
    'კომპანიის ინფო',
    'პოზიცია & მოთხოვნები',
    'პირობები & ანაზღ.',
    'ადგილმდ. & დაწყება',
    'დადასტურება'
  ];

  // ═════════════════════════════════════════
  // ✓ ქალაქები (ზემო 8)
  // ═════════════════════════════════════════
  cities = [
    'თბილისი',
    'ბათუმი',
    'ქუთაისი',
    'რუსთავი',
    'გორი',
    'ზუგდიდი',
    'ფოთი',
    'სამტრედია'
  ];

  // ═════════════════════════════════════════
  // ✓ სექტორი
  // ═════════════════════════════════════════
  sectorOptions = [
    'სუპერმარკეტი / მაღაზია',
    'კაფე / რესტორანი',
    'სასტუმრო / ჰოსპიტალობა',
    'საწყობი / ლოჯისტიკა',
    'ქოლ-ცენტრი',
    'ფარმაცია / აფთიაქი',
    'სამშენებლო',
    'IT / ტექნოლოგია',
    'ვაჭრობა / გაყიდვები',
    'სამედიცინო',
    'განათლება',
    'სხვა',
  ];

  // ═════════════════════════════════════════
  // ✓ კომპანიის ზომა
  // ═════════════════════════════════════════
  companySizeOptions = [
    '1–10 თანამშ.',
    '11–50 თანამშ.',
    '51–200 თანამშ.',
    '200+ თანამშ.'
  ];

  // ═════════════════════════════════════════
  // ✓ პოზიციები
  // ═════════════════════════════════════════
  positionOptions = [
    'მოლარე',
    'მიმტანი',
    'ბარმენი',
    'კასირი',
    'საწყობის მუშა',
    'ადმინისტრატორი',
    'ქოლ-ცენტრი',
    'მზარეული / კარგი',
    'დამლაგებელი',
    'მცველი',
    'მძღოლი',
    'პრომოუტერი',
    'ფარმაცევტი',
    'სხვა',
  ];

  // ═════════════════════════════════════════
  // ✓ კადრების რაოდენობა
  // ═════════════════════════════════════════
  headcountOptions = [
    '1',
    '2',
    '3',
    '4–5',
    '6–10',
    '10+'
  ];

  // ═════════════════════════════════════════
  // ✓ გამოცდილება
  // ═════════════════════════════════════════
  expOptions = [
    'გამოცდ. არ სჭირდება',
    '6 თვემდე',
    '6 თვე–1 წელი',
    '1–3 წელი',
    '3+ წელი'
  ];

  // ═════════════════════════════════════════
  // ✓ ენები
  // ═════════════════════════════════════════
  langOptions = [
    'ქართული',
    'ინგლისური',
    'რუსული',
    'გერმანული',
    'თურქული',
    'სხვა'
  ];

  // ═════════════════════════════════════════
  // ✓ სერტიფიკატები
  // ═════════════════════════════════════════
  certOptions = [
    'Food Safety',
    'HACCP',
    'სამედ. წიგნაკი',
    'პირველი დახმარება',
    'სამძღოლო (B)',
    'სამძღოლო (C/D)',
    'ფარმაცევტი',
    'ელექტრიკოსი',
    'სხვა',
  ];

  // ═════════════════════════════════════════
  // ✓ სამუშაოს ხანგრძლივობა
  // ═════════════════════════════════════════
  durationOptions = [
    { v: 'week',     t: '1 კვირა',  s: 'სწრაფი შევსება' },
    { v: 'twoweeks', t: '2 კვირა',  s: 'მოკლევადიანი' },
    { v: 'month',    t: '1 თვე',    s: 'საშუალოვადიანი' },
    { v: 'longer',   t: '1+ თვე',   s: 'გრძელვადიანი' },
  ];

  // ═════════════════════════════════════════
  // ✓ საღამო გრაფიკი
  // ═════════════════════════════════════════
  scheduleOptions = [
    'სრული განაკვეთი',
    'ნახევარი',
    'დილა (8–14)',
    'საღამო (14–22)',
    'ღამე (22–8)',
    'შაბათ-კვირა',
    'მოქნილი',
  ];

  // ═════════════════════════════════════════
  // ✓ ანაზღაურების ტიპი
  // ═════════════════════════════════════════
  payTypeOptions = [
    { v: 'monthly', t: 'თვიური',    s: 'ფიქსირებული' },
    { v: 'daily',   t: 'დღიური',    s: 'ყოველ დღე' },
    { v: 'hourly',  t: 'საათობრივ', s: 'Per-hour' },
    { v: 'project', t: 'პროექტი',   s: 'ერთჯერადი' },
  ];

  // ═════════════════════════════════════════
  // ✓ შეღავათები
  // ═════════════════════════════════════════
  benefitOptions = [
    'კვება',
    'ტრანსპორტი',
    'ფორმა',
    'ჯანდაცვა',
    'ბონუსი',
    'ტრენინგი',
    'სხვა',
  ];

  // ═════════════════════════════════════════
  // ✓ სამუშაოს დაწყება
  // ═════════════════════════════════════════
  startOptions = [
    { v: 'asap',     t: 'ახლავე',       s: 'დაუყოვნებლივ' },
    { v: 'week',     t: 'ამ კვირაში',   s: '7 დღის განმ.' },
    { v: 'twoweeks', t: '2 კვირაში',    s: '14 დღის განმ.' },
    { v: 'specific', t: 'კონკ. თარიღი', s: 'ქვემოთ მიუთითე' },
  ];

  // ═════════════════════════════════════════
  // ✓ სამუშაო გარემო
  // ═════════════════════════════════════════
  envOptions = [
    { v: 'indoor',  t: 'შიდა სივრცე', s: 'მაღაზია, ოფისი...' },
    { v: 'outdoor', t: 'გარე სამუშ.', s: 'ეზო, ქუჩა...' },
    { v: 'mixed',   t: 'შერეული',     s: '' },
  ];

  constructor(private jobRequestService: JobRequestService) {}

  /**
   * ========================================
   * ✓ ცარიელი მონაცემი
   * ========================================
   */
  emptyData(): CompanyData {
    return {
      companyName: '',
      sector: '',
      companySize: '',
      contactName: '',
      contactRole: '',
      phone: '',
      email: '',
      taxId: '',
      positions: [],
      headcount: '',
      expRequired: '',
      langs: ['ქართული'],
      certsRequired: [],
      requirements: '',
      duration: '',
      schedule: [],
      salaryFrom: '',
      salaryTo: '',
      payType: '',
      benefits: [],
      city: '',
      district: '',
      address: '',
      startDate: '',
      specificDate: '',
      workEnv: '',
      notes: '',
      agreed: false,
    };
  }

  /**
   * ========================================
   * ✓ პროგრეასი (%)
   * ========================================
   */
  get progress(): number {
    return Math.round(((this.currentStep + 1) / this.totalSteps) * 100);
  }

  /**
   * ========================================
   * ✓ ანაზღაურების ჩვენება
   * ========================================
   */
  get salaryDisplay(): string {
    if (!this.data.salaryFrom) return 'მოლაპარაკება';
    if (this.data.salaryTo) {
      return `${this.data.salaryFrom} – ${this.data.salaryTo} ₾`;
    }
    return `${this.data.salaryFrom} ₾`;
  }

  /**
   * ========================================
   * ✓ შემდეგი ნაბიჯი
   * ========================================
   */
  next(): void {
    if (!this.validate()) {
      this.shakeNext = true;
      setTimeout(() => (this.shakeNext = false), 400);
      return;
    }

    if (this.currentStep < this.totalSteps - 1) {
      this.direction = 'forward';
      this.currentStep++;
      this.errors = {};
    } else {
      this.submitForm();
    }
  }

  /**
   * ========================================
   * ✓ უკან დაბრუნება
   * ========================================
   */
  back(): void {
    if (this.currentStep > 0) {
      this.direction = 'back';
      this.currentStep--;
      this.errors = {};
    }
  }

  /**
   * ========================================
   * ✓ ფორმის გაგზავნა
   * ========================================
   */
  submitForm(): void {
    this.isLoading = true;
    console.log('🚀 ფორმა იგზავნება...', this.data);

    this.jobRequestService.submitJobRequest(this.data).subscribe({
      next: (response: any) => {
        console.log('✅ Server Response:', response);
        this.isLoading = false;
        this.submitted = true;  // ← SUCCESS MODAL აჩვენება!
        console.log('✅ submitted = true', this.submitted);
        
        // 5 წამის შემდეგ ავტომატური დახურვა
        setTimeout(() => {
          console.log('⏰ 5 წამი გავიდა, closeModal() ხდება');
          this.closeModal();
        }, 5000);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('❌ Error:', error);
        alert('უხოვ, რაღაც შეცდომა მოხდა! სცადეთ მოგვიანებით.');
      }
    });
  }

  /**
   * ========================================
   * ✓ ვალიდაცია ნაბიჯის მიხედვით
   * ========================================
   */
  validate(): boolean {
    this.errors = {};

    if (this.currentStep === 0) {
      if (!this.data.companyName) this.errors['companyName'] = true;
      if (!this.data.sector) this.errors['sector'] = true;
      if (!this.data.contactName) this.errors['contactName'] = true;
      if (!this.data.phone) this.errors['phone'] = true;
    }

    if (this.currentStep === 1) {
      if (this.data.positions.length === 0) this.errors['positions'] = true;
      if (!this.data.headcount) this.errors['headcount'] = true;
    }

    if (this.currentStep === 2) {
      if (!this.data.duration) this.errors['duration'] = true;
    }

    if (this.currentStep === 3) {
      if (!this.data.city) this.errors['city'] = true;
      if (!this.data.startDate) this.errors['startDate'] = true;
    }

    if (this.currentStep === 4) {
      if (!this.data.agreed) this.errors['agreed'] = true;
    }

    return Object.keys(this.errors).length === 0;
  }

  /**
   * ========================================
   * ✓ Chip ჩიპი (თეგი)
   * ========================================
   */
  toggleChip(arr: string[], val: string): void {
    const idx = arr.indexOf(val);
    if (idx > -1) {
      arr.splice(idx, 1);
    } else {
      arr.push(val);
    }
  }

  /**
   * ========================================
   * ✓ ჩიპი აქტიური?
   * ========================================
   */
  isChipActive(arr: string[], val: string): boolean {
    return arr.includes(val);
  }

  /**
   * ========================================
   * ✓ ხანგრძლივობის ლეიბელი
   * ========================================
   */
  durationLabel(v: string): string {
    const map: Record<string, string> = {
      week: '1 კვირა',
      twoweeks: '2 კვირა',
      month: '1 თვე',
      longer: '1+ თვე',
    };
    return map[v] || v || '—';
  }

  /**
   * ========================================
   * ✓ დაწყების თარიღის ლეიბელი
   * ========================================
   */
  startLabel(v: string): string {
    const map: Record<string, string> = {
      asap: 'ახლავე',
      week: 'ამ კვირაში',
      twoweeks: '2 კვირაში',
      specific: this.data.specificDate || 'კონკ. თარიღი',
    };
    return map[v] || v || '—';
  }

  /**
   * ========================================
   * ✓ რესეტი (ახალი მოთხოვნა)
   * ========================================
   */
  reset(): void {
    this.currentStep = 0;
    this.submitted = false;
    this.errors = {};
    this.data = this.emptyData();
    this.closed.emit();
  }

  /**
   * ========================================
   * ✓ მოდალის დახურვა
   * ========================================
   */
  closeModal(): void {
    this.reset();
  }

  /**
   * ========================================
   * ✓ Cleanup OnDestroy
   * ========================================
   */
  ngOnDestroy(): void {
    // cleanup
  }
}