import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';
import { HowItWorksComponent } from './how-it-works-component/how-it-works-component';
import { CandidatesComponent } from './candidates/candidates';
import { Forbusisness } from './forbusisness/forbusisness';

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
        
    }
];
