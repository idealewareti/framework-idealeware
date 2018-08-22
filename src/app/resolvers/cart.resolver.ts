import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";

import { Observable } from "rxjs";
import { CartManager } from "../managers/cart.manager";
import { Cart } from "../models/cart/cart";

@Injectable({
	providedIn: 'root'
})
export class CartResolver implements Resolve<Observable<Cart>> {

	constructor(private manager: CartManager) { }

	resolve(): Observable<Cart> {
		return this.manager.loadCart();
	}
}

