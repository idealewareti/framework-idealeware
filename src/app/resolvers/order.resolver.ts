import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Order } from "../models/order/order";
import { OrderManager } from "../managers/order.manager";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";

declare var toastr: any;

@Injectable({
    providedIn: 'root'
})
export class OrderResolver implements Resolve<Observable<Order>>{
    constructor(private orderManager: OrderManager) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Order> {
        const id = route.params.id;
        return this.orderManager.getOrder(id)
            .pipe(tap(() => { }
                , error => {
                    toastr['error']('Ops! Não foi possível processar sua solicitação. Por favor aguarde alguns instantes e tente novamente.');
                    throw new Error(`${error.error} Status: ${error.status}`);
                }
            ));
    }
}