import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { isPlatformServer } from "@angular/common";
import { Injector } from '@angular/core';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { RedirectFrom } from "../models/redirect301/redirectFrom";
import { Redirect301Manager } from "../managers/redirect301.manager";
import { RedirectTo } from "../models/redirect301/redirectTo";
import { tap } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class Redirect301Resolver implements Resolve<Observable<RedirectTo>> {

    constructor(
        private manager: Redirect301Manager,
        private router: Router,
        private injector: Injector,
        @Inject(PLATFORM_ID) private platformId: Object) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RedirectTo> {

        if (state.url.includes("/not-found")) return null;

        let redirectFrom = new RedirectFrom();
        redirectFrom.redirectFrom = state.url;

        if (!this.verifyPicture(redirectFrom.redirectFrom))
            return this.manager.getRedirectTo(redirectFrom).pipe(tap(redirect => {
                if (redirect) {
                    if (isPlatformServer(this.platformId)) {
                        const response = this.injector.get(RESPONSE);
                        response.redirect(301, redirect.redirectTo);
                    } else {
                        this.router.navigateByUrl(redirect.redirectTo);
                    }
                }
            }));

        return null;
    }

    verifyPicture(url: string): boolean {
        const regex = /\.(gif|jpg|jpeg|tiff|png)$/;
        return regex.test(url);
    }
}