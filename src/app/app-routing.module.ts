import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';
import { NotFoundPage } from './pages/not-found';
import { ProfilePage } from './pages/profile';
import { RegisterPage } from './pages/register';
import { VotePositionPage } from './pages/vote-positions';
import { VoteSessionDetailPage } from './pages/vote-session-detail';
import { VoteSessionsPage } from './pages/vote-sessions';
import { AdminLoginGuard } from './services/admin-login.guard';
import { LoginGuard } from './services/login.guard';

const routes: Routes = [
    { path: '', redirectTo: "/home", pathMatch: 'full' },
    { path: 'home', component: HomePage, canActivate: [LoginGuard] },
    { path: 'register', component: RegisterPage },
    { path: 'login', component: LoginPage },
    { path: 'profile', component: ProfilePage, canActivate: [LoginGuard] },
    { path: 'vote-positions', component: VotePositionPage, canActivate: [AdminLoginGuard] },
    { path: 'vote-sessions', component: VoteSessionsPage, canActivate: [AdminLoginGuard] },
    { path: 'vote-sessions/:id', component: VoteSessionDetailPage, canActivate: [AdminLoginGuard] },
    { path: '**', component: NotFoundPage, },
];

const pages = [
    NotFoundPage,
    RegisterPage,
    LoginPage,
    HomePage,
    ProfilePage,
    VoteSessionsPage,
    VotePositionPage,
    VoteSessionDetailPage
];

@NgModule({
    declarations: [
        ...pages,
    ],
    imports: [RouterModule.forRoot(routes), ReactiveFormsModule, CommonModule],
    exports: [RouterModule]
})
export class AppRoutingModule { }
