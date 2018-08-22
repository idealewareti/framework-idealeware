import { Injectable } from "@angular/core";
import { DneAddressService } from "../services/dneaddress.service";
import { DneAddress } from "../models/dne/dneaddress";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DneAddressManager {

    constructor(private service: DneAddressService) {}

    getAddress(zipcode: string): Observable<DneAddress> {
        return this.service.getAddress(zipcode);
    }
}