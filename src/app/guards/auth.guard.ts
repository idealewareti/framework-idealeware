import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private jwtService: JwtHelperService,
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        var authenticated = !this.jwtService.isTokenExpired();
        if (!authenticated) this.router.navigate(["/login"], { queryParams: { step: state.url } });
        return authenticated;
    }
}