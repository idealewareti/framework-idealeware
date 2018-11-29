import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";

import { Observable } from "rxjs";
import { CartManager } from "../managers/cart.manager";
import { Cart } from "../models/cart/cart";
import { tap } from "rxjs/operators";
import { CouponManager } from "../managers/coupon.manager";
import { isPlatformBrowser } from "@angular/common";

declare var toastr: any;

@Injectable({
	providedIn: 'root'
})
export class CartResolver implements Resolve<Observable<Cart>> {

	constructor(
		private cartManager: CartManager,
		private couponManager: CouponManager,
		private router: Router,
		@Inject(PLATFORM_ID) private platformId: Object) { }

	resolve(route: ActivatedRouteSnapshot): Observable<Cart> {
		if (isPlatformBrowser(this.platformId)) {
			let id = route.params.id;

			if (id)
				id = id.substr(id.length - 36);

			if (id) {
				this.cartManager.setCartId(id);

				let couponCode = route.queryParams.coupon;

				if (couponCode)
					this.applyCoupon(id, couponCode);
			}


			return this.cartManager.loadCart()
				.pipe(tap((cart) => {
					if (id && cart.id !== id) {
						this.router.navigateByUrl('/carrinho');
					}
				}, error => {
					toastr['error']('Ops! Não foi possível processar sua solicitação. Por favor aguarde alguns instantes e tente novamente.');
					throw new Error(`${error.error} Status: ${error.status}`);
				}));
		}
	}

	private applyCoupon(cartId: string, couponCode: string) {
		this.couponManager.getCouponDiscount(cartId, couponCode)
			.subscribe(cart => {
				this.cartManager.updateCartFromEmitter(cart);
			}, err => { });
	}
}

