import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registerperson',
  imports: [CommonModule, FormsModule],
  templateUrl: './registerperson.html',
  styleUrl: './registerperson.scss',
  encapsulation: ViewEncapsulation.None
})
export class Registerperson {
  @Output() closed = new EventEmitter<void>();

  currentStep = 1;
  showPassword = false;
  showConfirmPassword = false;

  stepTitles = ['პირადი ინფო', 'გამოცდილება', 'ანგარიშის შექმნა'];
  stepSubs = [
    'შეავსეთ თქვენი პირადი მონაცემები',
    'გვიამბეთ თქვენი გამოცდილების შესახებ',
    'შეიყვანეთ საკონტაქტო ინფორმაცია'
  ];

  step1 = {
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    idNumber: '',
    city: ''
  };

  step2 = {
    sector: '',
    experience: '',
    availability: '',
    schedules: [] as string[]
  };

  step3 = {
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  cities = [
    'თბილისი',
    'ბათუმი',
    'ქუთაისი',
    'რუსთავი',
    'გორი',
    'ზუგდიდი',
    'სხვა'
  ];

  sectors = [
    'მოლარე',
    'მიმტანი / ბარმენი',
    'მზარეული / მომხარშავი',
    'საწყობის თანამშრომელი',
    'მოსაწყობი / პრომოუტერი',
    'მოვლის პერსონალი',
    'ქოლ-ცენტრის ოპერატორი',
    'დამლაგებელი',
    'სხვა'
  ];

  availabilities = ['ამ კვირაში', '1–2 კვირაში', '1 თვეში', 'ნებისმიერ დროს'];

  schedules = ['სრული განაკვეთი', 'ნახევარი განაკვეთი', 'მხოლოდ დღე', 'მხოლოდ ღამე', 'შაბათ-კვირა'];

  isScheduleSelected(s: string): boolean {
    return this.step2.schedules.includes(s);
  }

  toggleSchedule(s: string): void {
    const idx = this.step2.schedules.indexOf(s);
    if (idx > -1) {
      this.step2.schedules.splice(idx, 1);
    } else {
      this.step2.schedules.push(s);
    }
  }

  goNext(): void {
    if (this.currentStep < 3) this.currentStep++;
  }

  goBack(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  close(): void {
    this.closed.emit();
  }

  submit(): void {
    console.log('Person registration:', {
      ...this.step1,
      ...this.step2,
      ...this.step3
    });
    this.close();
  }
}