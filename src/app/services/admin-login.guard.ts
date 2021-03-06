import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CoreService } from './core.service';

@Injectable({
    providedIn: 'root'
})
export class AdminLoginGuard implements CanActivate {

    constructor(public coreService: CoreService) { }

    canActivate(_next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.coreService.member?.nin && this.coreService.member.status === 'Administrator') return true;
        this.coreService.lastUrl = state.url;
        return this.coreService.router.navigate(["/login"]);
    }
}