import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registercompany',
  imports: [CommonModule, FormsModule],
  templateUrl: './registercompany.html',
  styleUrl: './registercompany.scss',
  encapsulation: ViewEncapsulation.None
})
export class Registercompany {
  @Output() closed = new EventEmitter<void>();

  currentStep = 1;
  showPassword = false;
  showConfirmPassword = false;
  codeError = '';

  step1 = {
    name: '',
    code: '',
    sector: '',
    city: ''
  };

  step2 = {
    contactName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  sectors = [
    'სუპერმარკეტი',
    'რესტორანი / კაფე',
    'სასტუმრო',
    'საწყობი',
    'აფთიაქი',
    'სავაჭრო ცენტრი',
    'ქოლ-ცენტრი',
    'სხვა'
  ];

  cities = [
    'თბილისი',
    'ბათუმი',
    'ქუთაისი',
    'რუსთავი',
    'გორი',
    'ზუგდიდი',
    'სხვა'
  ];

  goNext() {
    const code = this.step1.code.trim();
    if (!/^\d{9}$/.test(code)) {
      this.codeError = 'საიდენტიფიკაციო კოდი უნდა შეიცავდეს ზუსტად 9 ციფრს';
      return;
    }
    this.codeError = '';
    this.currentStep = 2;
  }

  goBack() {
    this.currentStep = 1;
  }

  close() {
    this.closed.emit();
  }

  submit() {
    console.log('Company registration:', { ...this.step1, ...this.step2 });
    this.close();
  }
}