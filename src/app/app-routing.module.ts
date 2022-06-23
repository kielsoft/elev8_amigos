import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { components } from './components';
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';
import { NotFoundPage } from './pages/not-found';
import { ProfilePage } from './pages/profile';
import { RegisterPage } from './pages/register';
import { LoginGuard } from './services/login.guard';

const routes: Routes = [
    { path: '', component: HomePage, pathMatch: 'full',  canActivate: [LoginGuard] },
    { path: 'register', component: RegisterPage },
    { path: 'login', component: LoginPage },
    { path: 'profile', component: ProfilePage, canActivate: [LoginGuard] },
    { path: '**', component: NotFoundPage, },
];

const pages = [
    NotFoundPage,
    RegisterPage,
    LoginPage,
    HomePage,
    ProfilePage,

];

@NgModule({
    declarations: [
        ...pages,
    ],
    imports: [RouterModule.forRoot(routes), ReactiveFormsModule, CommonModule],
    exports: [RouterModule]
})
export class AppRoutingModule { }
