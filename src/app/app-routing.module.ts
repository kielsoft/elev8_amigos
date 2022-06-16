import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { components } from './components';
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';
import { NotFoundPage } from './pages/not-found';
import { RegisterPage } from './pages/register';

const routes: Routes = [
    { path: '', component: HomePage, pathMatch: 'full' },
    { path: 'register', component: RegisterPage },
    { path: 'login', component: LoginPage },
    { path: '**', component: NotFoundPage, },
];

const pages = [
    NotFoundPage,
    RegisterPage,
    LoginPage,
    HomePage,
];

@NgModule({
    declarations: [
        ...pages,
    ],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
