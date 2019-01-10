import { Injectable, Injector, PLATFORM_ID, Inject } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { Product } from "../models/product/product";
import { ProductManager } from "../managers/product.manager";
import { tap, catchError } from "rxjs/operators";
import { RedirectFrom } from "../models/redirect301/redirectFrom";
import { isPlatformServer } from "@angular/common";
import { Redirect301Manager } from "../managers/redirect301.manager";
import { RESPONSE } from "@nguniversal/express-engine/tokens";
import { RedirectTo } from "../models/redirect301/redirectTo";

@Injectable({
    providedIn: 'root'
})
export class ProductResolver implements Resolve<Observable<Product | RedirectTo>> {

    constructor(private manager: ProductManager,
        private redirectManager: Redirect301Manager,
        private router: Router,
        private injector: Injector,
        @Inject(PLATFORM_ID) private platformId: Object) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product | RedirectTo> {
        let id = route.params.produto_id;
        if (id)
            id = id.substr(id.length - 36);

        return this.manager.getProductBySku(id)
            .pipe(catchError(err => {
                let redirectFrom = new RedirectFrom();
                redirectFrom.redirectFrom = state.url;

                if (!this.verifyPicture(redirectFrom.redirectFrom))
                    return this.redirectManager.getRedirectTo(redirectFrom).pipe(tap(redirect => {
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
            }));
    }

    verifyPicture(url: string): boolean {
        const regex = /\.(gif|jpg|jpeg|tiff|png)$/;
        return regex.test(url);
    }
}