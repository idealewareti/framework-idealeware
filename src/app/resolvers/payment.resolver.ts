import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

import { Payment } from "../models/payment/payment";
import { PaymentManager } from "../managers/payment.manager";
import { tap } from "rxjs/operators";

declare var toastr: any;

@Injectable({
    providedIn: 'root'
})
export class PaymentResolver implements Resolve<Observable<Payment[]>>{
    constructor(
        private paymentManager: PaymentManager
    ) { }

    resolve(): Observable<Payment[]> {
        return this.paymentManager.getAll()
            .pipe(tap(() => { },
                error => {
                    toastr['error']('Ops! Não foi possível processar sua solicitação. Por favor aguarde alguns instantes e tente novamente.');
                    throw new Error(`${error.error} Status: ${error.status}`);
                }
            ));
    }
}