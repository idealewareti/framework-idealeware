import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Order } from "../models/order/order";
import { OrderManager } from "../managers/order.manager";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class OrderResolver implements Resolve<Observable<Order>>{
    constructor(private orderManager: OrderManager) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Order> {
        const id = route.params.id;
        return this.orderManager.getOrder(id);
    }
}