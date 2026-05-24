import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from "@angular/router";
import { PersonalComponent } from '../personal-component/personal-component';
import { CommonModule } from '@angular/common';
import { Iamcompany } from '../iamcompany/iamcompany';
import { ChooseRole } from '../choose-role/choose-role';
import { Registercompany } from '../registercompany/registercompany';
import { Registerperson } from '../registerperson/registerperson';

@Component({
  selector: 'app-home',
  imports: [PersonalComponent, CommonModule, Iamcompany, RouterLink, ChooseRole, Registercompany,Registerperson],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  encapsulation: ViewEncapsulation.None
})
export class Home {
  showRegistration = false;
  showCompanyRegistration = false;
  showChooseRole = false;
  showIamcompany = false;        // ← ახალი
  showPersonalComponent = false;

  onRoleSelected(role: 'company' | 'worker') {
    if (role === 'company') {
      this.showCompanyRegistration = true;
    } else {
      this.showRegistration = true;
    }
  }
}