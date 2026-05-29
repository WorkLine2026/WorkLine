import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';
import { HowItWorksComponent } from './how-it-works-component/how-it-works-component';
import { CandidatesComponent } from './candidates/candidates';
import { Forbusisness } from './forbusisness/forbusisness';
import { PersonalComponent } from './Company and Person/personal-component/personal-component';
import { Iamcompany } from './Company and Person/iamcompany/iamcompany';
import { Contact } from './contact/contact';
import { ChooseRole } from './choose-role/choose-role';
import { RegistercompanyComponent } from './Register-LoginIn/registercompany/registercompany';
import { Registerperson } from './Register-LoginIn/registerperson/registerperson';
import { Login } from './Register-LoginIn/login-in/login-in';
import { CompanyProfileComponent } from './Profile/company-profile-component/company-profile-component';
import { PersonProfile } from './Profile/person-profile/person-profile';
import { AdminPanelComponent } from './AdminPanel/admin-panel-component/admin-panel-component';
import { AdminLoginComponent } from './AdminPanel/admin-login/admin-login';

export const routes: Routes = [
    { path: '',                 component: Home },
    { path: 'home',             component: Home },
    { path: 'navbar',           component: Navbar },
    { path: 'footer',           component: Footer },
    { path: 'how-it-works',     component: HowItWorksComponent },
    { path: 'candidates',       component: CandidatesComponent },
    { path: 'forbusiness',      component: Forbusisness },
    { path: 'personal-component', component: PersonalComponent },
    { path: 'iamcompany',       component: Iamcompany },
    { path: 'contact',          component: Contact },
    { path: 'choose-role',      component: ChooseRole },
    { path: 'registercompany',  component: RegistercompanyComponent },
    { path: 'registerperson',   component: Registerperson },
    { path: 'login',            component: Login },
    { path: 'company/profile',  component: CompanyProfileComponent },
    { path: 'person/profile',   component: PersonProfile },
    { path: 'admin/login',      component:AdminLoginComponent},
    { path: 'admin/panel',      component:AdminPanelComponent},
    { path: '**',               redirectTo: '' },
];