import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

import { Customer } from "../models/customer/customer";
import { CustomerManager } from "../managers/customer.manager";
import { tap } from "rxjs/operators";

declare var toastr: any;

@Injectable({
    providedIn: 'root'
})
export class CustomerResolver implements Resolve<Observable<Customer>>{
    constructor(
        private customerManager: CustomerManager
    ) { }

    resolve(): Observable<Customer> {
        return this.customerManager.getUser()
            .pipe(tap(() => { }
                , error => {
                    toastr['error']('Ops! Não foi possível processar sua solicitação. Por favor aguarde alguns instantes e tente novamente.');
                    throw new Error(`${error.error} Status: ${error.status}`);
                }
            ));
    }
}