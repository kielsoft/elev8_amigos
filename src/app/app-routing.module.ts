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
import { VotePosition } from './pages/vote-position';
import { VoteSession } from './pages/vote-session';
import { AdminLoginGuard } from './services/admin-login.guard';
import { LoginGuard } from './services/login.guard';

const routes: Routes = [
    { path: '', redirectTo: "/home", pathMatch: 'full' },
    { path: 'home', component: HomePage, canActivate: [LoginGuard] },
    { path: 'register', component: RegisterPage },
    { path: 'login', component: LoginPage },
    { path: 'profile', component: ProfilePage, canActivate: [LoginGuard] },
    { path: 'vote-sessions', component: VoteSession, canActivate: [AdminLoginGuard] },
    { path: 'vote-positions', component: VotePosition, canActivate: [AdminLoginGuard] },
    { path: '**', component: NotFoundPage, },
];

const pages = [
    NotFoundPage,
    RegisterPage,
    LoginPage,
    HomePage,
    ProfilePage,
    VoteSession,
    VotePosition,
];

@NgModule({
    declarations: [
        ...pages,
    ],
    imports: [RouterModule.forRoot(routes), ReactiveFormsModule, CommonModule],
    exports: [RouterModule]
})
export class AppRoutingModule { }
