import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { WorkerService } from '../../Service/Worker.service';

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
  salary: string;
  cvNames: string;
}

@Component({
  selector: 'app-personal-component',
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [WorkerService],
  templateUrl: './personal-component.html',
  styleUrl: './personal-component.scss',
})
export class PersonalComponent {

  @Output() closed = new EventEmitter<void>();

  currentStep = 0;
  totalSteps = 5;
  direction: 'forward' | 'back' = 'forward';
  submitted = false;
  shakeNext = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  workerId = '';

  data: WorkerData = this.emptyData();
  newCertInput = '';
  errors: Record<string, boolean> = {};

  // აბსოლუტურად ყველა ორიგინალი მნიშვნელობა უცვლელად:
  cities = ['თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'გორი', 'ზუგდიდი', 'ფოთი', 'სამტრედია'];
  genders = ['მამრობითი', 'მდედრობითი', 'სხვა'];
  sectorOptions = ['მოლარე', 'მიმტანი', 'საწყობი', 'ადმინი', 'ქოლ-ცენტრი', 'სამზარეულო', 'დამლაგებელი', 'მძღოლი', 'მცველი', 'ბარმენი', 'კასირი', 'პრომოუტერი', 'სხვა'];
  expOptions = ['გამოცდ. არ მაქვს', '6 თვემდე', '6 თვე–1 წელი', '1–3 წელი', '3–5 წელი', '5+ წელი'];
  eduOptions = ['საბაზო', 'საშუალო', 'პროფესიული', 'ბაკალავრი', 'მაგისტრი', 'დოქტორი'];
  langOptions = ['ქართული', 'ინგლისური', 'რუსული', 'გერმანული', 'თურქული', 'სომხური', 'სხვა'];
  computerOptions = ['Word / Excel', '1C', 'Canva', 'სალაროს პროგ.', 'ელ-ფოსტა', 'სხვა'];
  certOptions = ['Food Safety', 'HACCP', 'პირველი დახმარება', 'სამძღოლო (B)', 'სამძღოლო (C/D)', 'ფარმაცევტი', 'ელექტრიკოსი', 'შემდუღებელი', 'ბუღალტერი', 'სხვა'];
  
  restrictionOptions = [
    { id: 'h-back', label: 'ზურგის პრობლემები', sub: 'მძიმე ტვირთის ტარება შეზღუდული' },
    { id: 'h-stand', label: 'დგომა 8+ საათი', sub: 'ფეხზე დგომა გახანგრძლივებული' },
    { id: 'h-lift', label: 'მძიმე ტვირთი (20+ კგ)', sub: 'ფიზიკური დატვირთვა' },
    { id: 'h-screen', label: 'ეკრანთან მუშაობა 8+ სთ', sub: 'კომპიუტერი / კასა' },
    { id: 'h-outdoor', label: 'გარე სამუშაო', sub: 'ამინდის ზემოქმედება' },
  ];
  
  medbookOptions = [
    { v: 'yes', t: 'გაქვს', s: 'მოქმედი' },
    { v: 'expired', t: 'ვადაგასული', s: 'განახლება საჭ.' },
    { v: 'no', t: 'არ გაქვს', s: '' },
  ];
  
  availOptions = [
    { v: 'asap', t: 'ახლავე მზად', s: 'დაუყოვნებლივ' },
    { v: 'week', t: 'ამ კვირაში', s: '7 დღის განმ.' },
    { v: 'twoweeks', t: '2 კვირაში', s: '14 დღის განმ.' },
    { v: 'month', t: '1 თვეში', s: '30 დღის განმ.' },
  ];
  
  scheduleOptions = ['სრული განაკვეთი', 'ნახევარი', 'დილა (8–14)', 'საღამო (14–22)', 'ღამე (22–8)', 'შაბათ-კვირა', 'მოქნილი'];
  stepLabels = ['პირადი & საკონტაქტო', 'გამოცდილება & განათლება', 'სერტიფიკატები', 'ჯანმრთელობა', 'ხელმისაწვდომობა'];

  constructor(private workerService: WorkerService) { }

  emptyData(): WorkerData {
    return {
      fname: '', lname: '', dob: '', gender: '', pid: '', city: '',
      phone: '', email: '', wa: '', fb: '',
      sectors: [], exp: '', edu: '', langs: ['ქართული'], computer: [], bio: '',
      certs: [], customCerts: [], certFiles: '',
      restrictions: [], medbook: '', healthNote: '',
      avail: '', schedule: [], salary: '', cvNames: '',
    };
  }

  get progress(): number {
    return Math.round((this.currentStep + 1) / this.totalSteps * 100);
  }

  get allCerts(): string[] {
    return [...this.data.certs, ...this.data.customCerts];
  }

  next(): void {
    if (!this.validate()) {
      this.shakeNext = true;
      setTimeout(() => this.shakeNext = false, 400);
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

  back(): void {
    if (this.currentStep > 0) {
      this.direction = 'back';
      this.currentStep--;
      this.errors = {};
    }
  }

 validate(): boolean {
    this.errors = {};
    
    // ნაბიჯი 1-ის ვალიდაცია: პირადი & საკონტაქტო
    if (this.currentStep === 0) {
      if (!this.data.fname?.trim()) this.errors['fname'] = true;
      if (!this.data.lname?.trim()) this.errors['lname'] = true;
      if (!this.data.city) this.errors['city'] = true;
      if (!this.data.phone?.trim()) this.errors['phone'] = true;
    }
    
    // ნაბიჯი 2-ის ვალიდაცია: გამოცდილება & განათლება
    if (this.currentStep === 1) {
      if (this.data.sectors.length === 0) this.errors['sectors'] = true;
      if (!this.data.exp) this.errors['exp'] = true;
    }
    
    // ნაბიჯი 5-ის ვალიდაცია: ხელმისაწვდომობა & ანაზღაურება (აქ გასწორდა შეცდომა)
    if (this.currentStep === 4) {
      if (!this.data.avail) this.errors['avail'] = true;
      if (this.data.salary === null || this.data.salary === undefined || !this.data.salary.toString().trim()) {
        this.errors['salary'] = true;
      }
    }
    
    return Object.keys(this.errors).length === 0;
  }

  submitForm(): void {
    if (!this.data.email) {
      this.errorMessage = 'ელ-ფოსტა აუცილებელია ხელმისაწვდომი საშუალებისთვის';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.workerService.createWorker(this.data).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.submitted = true;
        this.successMessage = response.message || 'პროფილი წარმატებით შენახულია';
        this.workerId = response.workerId || '';
        console.log('✅ Worker created successfully:', response);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error || 'შეცდომა ფორმის გაგზავნის დროს';
        console.error('❌ Error creating worker:', error);
      }
    });
  }

  toggleChip(arr: string[], val: string): void {
    const idx = arr.indexOf(val);
    if (idx > -1) arr.splice(idx, 1); else arr.push(val);
  }

  isChipActive(arr: string[], val: string): boolean {
    return arr.includes(val);
  }

  toggleRestriction(id: string): void {
    const idx = this.data.restrictions.indexOf(id);
    if (idx > -1) this.data.restrictions.splice(idx, 1);
    else this.data.restrictions.push(id);
  }

  isRestricted(id: string): boolean {
    return this.data.restrictions.includes(id);
  }

  addCert(): void {
    const val = this.newCertInput.trim();
    if (!val) return;
    this.data.customCerts.push(val);
    this.newCertInput = '';
  }

  removeCert(i: number): void {
    this.data.customCerts.splice(i, 1);
  }

  onCertFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.data.certFiles = Array.from(input.files).map(f => f.name).join(', ');
    }
  }

  onCvFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.data.cvNames = Array.from(input.files).map(f => f.name).join(', ');
    }
  }

  onEnterCert(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addCert();
    }
  }

  availLabel(v: string): string {
    const map: Record<string, string> = { 
      asap: 'ახლავე მზად', 
      week: 'ამ კვირაში', 
      twoweeks: '2 კვირაში', 
      month: '1 თვეში' 
    };
    return map[v] || v;
  }

  restrictionLabel(id: string): string {
    const map: Record<string, string> = { 
      'h-back': 'ზურგი', 
      'h-stand': 'დგომა 8სთ', 
      'h-lift': 'მძ. ტვირთი', 
      'h-screen': 'ეკრანი 8სთ', 
      'h-outdoor': 'გარე სამუშ.' 
    };
    return map[id] || id;
  }

  medbookLabel(v: string): string {
    const map: Record<string, string> = { 
      yes: 'მოქმედი', 
      expired: 'ვადაგასული', 
      no: 'არ გაქვს' 
    };
    return map[v] || v;
  }

  reset(): void {
    this.currentStep = 0;
    this.submitted = false;
    this.errors = {};
    this.data = this.emptyData();
    this.newCertInput = '';
    this.successMessage = '';
    this.errorMessage = '';
    this.workerId = '';
  }

  close(): void {
    this.closed.emit();
  }
}