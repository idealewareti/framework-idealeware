import { Injectable } from "../../../node_modules/@angular/core";
import { Observable } from "../../../node_modules/rxjs";

import { OrderService } from "../services/order.service";
import { CartManager } from "./cart.manager";
import { Cart } from "../models/cart/cart";
import { Order } from "../models/order/order";

@Injectable({
    providedIn: 'root'
})
export class OrderManager{
    constructor(
        private orderService: OrderService,
        private cartManager: CartManager
    ){}

    /**
     * Validar ordem API
     */
    validateOrder(): Observable<Cart> {
        return this.orderService.validateOrder(this.cartManager.getCartId());
    }

    /**
     * Persistir ordem API
     */
    placeOrder(): Observable<Order> {
        return this.orderService.placeOrder(this.cartManager.getCartId());
    }

    /**
     * Selecionar ordem por id
     * @param id 
     */
    getOrder(id: string): Observable<Order> {
        return this.orderService.getOrder(id);
    }

    getOrders(): Observable<Order[]> {
        return this.orderService.getOrders();
    }
}