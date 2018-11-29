import { Injectable } from '@angular/core';
import { Customer } from '../models/customer/customer';
import { CustomerAddress } from '../models/customer/customer-address';
import { Token } from '../models/customer/token';
import { HttpClientHelper } from '../helpers/http.helper';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    client: HttpClientHelper;

    constructor(http: HttpClient) {
        this.client = new HttpClientHelper(http);
    }

    createCustomer(customer: Customer): Observable<Customer> {
        let url = `${environment.API_CUSTOMER}/customers`;
        return this.client.post(url, customer);

    }

    login(user, password): Observable<Token> {
        let url = `${environment.API_AUTHENTICATE}/authenticate/login`;
        return this.client.post(url, { cpfEmail: user, password: password })
            .pipe(map(res => res.body));
    }

    getUser(): Observable<Customer> {
        let url = `${environment.API_CUSTOMER}/customers`;
        return this.client.get(url);
    }

    saveAddress(address: CustomerAddress): Observable<CustomerAddress> {
        let url = `${environment.API_CUSTOMER}/customers/address`;
        return this.client.post(url, address);

    }

    updateAddress(address: CustomerAddress): Observable<CustomerAddress> {
        let url = `${environment.API_CUSTOMER}/customers/address`;
        return this.client.put(url, address);
    }

    deleteAddress(addressId: string): Observable<{}> {
        let url = `${environment.API_CUSTOMER}/customers/${addressId}`;
        return this.client.delete(url);
    }

    updateCustomer(customer: Customer): Observable<Customer> {
        let url = `${environment.API_CUSTOMER}/customers`;
        return this.client.put(url, customer);
    }

    getTokenPassword(email: string): Observable<string> {
        let url = `${environment.API_CUSTOMER}/customers/token/${email}`;
        return this.client.get(url);
    }

    recoverPassword(token: string, password: string) {
        let url = `${environment.API_CUSTOMER}/customers/forgot-password/${password}/${token}`;
        return this.client.put(url);
    }

    validForgotPasswordToken(token: string){
        let url = `${environment.API_CUSTOMER}/customers/valid-forgot-password/${token}`;
        return this.client.get(url);    
    }
}