import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

import { Customer } from "../models/customer/customer";
import { CustomerManager } from "../managers/customer.manager";

@Injectable({
    providedIn: 'root'
})
export class CustomerResolver implements Resolve<Observable<Customer>>{
    constructor(
        private customerManager: CustomerManager
    ) { }

    resolve(): Observable<Customer> {
        return this.customerManager.getUser();
    }
}