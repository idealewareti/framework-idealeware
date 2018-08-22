import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
    providedIn: 'root'
})
export class NotAuthGuard implements CanActivate {

    constructor(
        private jwtService: JwtHelperService,
        private router: Router) { }

    canActivate(): boolean {
        var authenticated = this.jwtService.isTokenExpired();
        if (!authenticated) this.router.navigateByUrl("/");
        return authenticated;
    }
}