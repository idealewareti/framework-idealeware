import { Injectable } from "@angular/core";
import { CartShowcaseService } from "../services/cart-showcase.service";
import { Observable } from "rxjs";
import { CartShowCase } from "../models/cart-showcase/cart-showcase";

@Injectable({
    providedIn: 'root'
})
export class CartShowcaseManager {
    constructor(
        private cartShowCaseService: CartShowcaseService
    ) { }

    getCartShowCase(): Observable<CartShowCase> {
        return this.cartShowCaseService.getCartShowCase();
    }
}