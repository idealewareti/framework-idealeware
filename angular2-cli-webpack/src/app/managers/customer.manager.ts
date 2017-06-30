import { Injectable } from "@angular/core";
import { CustomerService } from "app/services/customer.service";

@Injectable()
export class CustomerManager{

    constructor(private service: CustomerService){}
}