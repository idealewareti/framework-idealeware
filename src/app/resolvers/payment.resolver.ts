import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

import { Payment } from "../models/payment/payment";
import { PaymentManager } from "../managers/payment.manager";

@Injectable({
    providedIn: 'root'
})
export class PaymentResolver implements Resolve<Observable<Payment[]>>{
    constructor(
        private paymentManager: PaymentManager
    ) { }

    resolve(): Observable<Payment[]> {
        return this.paymentManager.getAll();
    }
}