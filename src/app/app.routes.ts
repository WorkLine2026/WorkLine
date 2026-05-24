import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';
import { HowItWorksComponent } from './how-it-works-component/how-it-works-component';
import { CandidatesComponent } from './candidates/candidates';
import { Forbusisness } from './forbusisness/forbusisness';
import { PersonalComponent } from './personal-component/personal-component';
import { combineLatest } from 'rxjs';
import { Iamcompany } from './iamcompany/iamcompany';
import { Contact } from './contact/contact';
import { ChooseRole } from './choose-role/choose-role';
import { RegistercompanyComponent } from './registercompany/registercompany';
import { Registerperson } from './registerperson/registerperson';
import { Login, } from './login-in/login-in';
import { CompanyProfileComponent } from './company-profile-component/company-profile-component';

export const routes: Routes = [
    {
        path: "", component: Home
    },
    {
        path: "home", component: Home
    },
    {
        path: "navbar", component: Navbar
    },
    {
        path: "footer", component: Footer
    },
    {
        path: "how-it-works", component:HowItWorksComponent
    },
    {
        path: "candidates", component:CandidatesComponent
    },
    {
        path: "forbusiness", component:Forbusisness
        
    },
    {
        path: "personal-component", component:PersonalComponent
    },
    {
        path: "iamcompany", component:Iamcompany
    },
    {
        path: "contact", component:Contact
    },
    {
        path: "choose-role", component:ChooseRole
    },
    {
        path: "registercompany", component: RegistercompanyComponent
    },
    {
        path: "registerperon", component:Registerperson
    },
    {
        path: "login-in", component:Login
    },
    {
        path: "company/profile", component:CompanyProfileComponent
    }
];
