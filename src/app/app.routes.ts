import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';

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
    }
];
