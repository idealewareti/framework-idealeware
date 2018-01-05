import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Customer } from '../models/customer/customer';
import { CustomerAddress } from '../models/customer/customer-address';
import { Login } from '../models/customer/login';
import { Token } from '../models/customer/token';
import { HttpClientHelper } from '../helpers/http.helper';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class CustomerService {
    client: HttpClientHelper;

    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    createCustomer(customer: Customer): Observable<Customer> {
        let url = `${environment.API_CUSTOMER}/customers`;
        return this.client.post(url, customer)
            .map(res => res.json());

    }

    login(user, password): Promise<Token> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_AUTHENTICATE}/authenticate/login`;
            this.client.post(url, new Login(user, password))
                .map(res => res.json())
                .subscribe(authenticate => {
                    let user = new Customer(authenticate.customer);
                    let token: Token = new Token();
                    token.accessToken = authenticate.accessToken;
                    token.tokenType = authenticate.tokenType;
                    token.expiresIn = authenticate.expiresIn;
                    token.createdDate = new Date(authenticate.createdDate);
                    token.customer = authenticate.customer;
                    resolve(token);
                }, error => reject(error));

        });
    }

    getUser(token: Token): Observable<Customer> {
        let url = `${environment.API_CUSTOMER}/customers`;
        return this.client.get(url, token)
            .map(res => res.json());
    }

    saveAddress(address: CustomerAddress, token: Token): Observable<CustomerAddress> {
        let url = `${environment.API_CUSTOMER}/customers/address`;
        return this.client.post(url, address, token)
            .map(res => res.json());

    }

    updateAddress(address: CustomerAddress, token: Token): Observable<CustomerAddress> {
        let url = `${environment.API_CUSTOMER}/customers/address`;
        return this.client.put(url, address, token)
            .map(res => res.json());
    }

    deleteAddress(addressId: string, token: Token): Promise<{}> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_CUSTOMER}/customers/${addressId}`;
            this.client.delete(url, token)
                .map(res => {
                    if (res.status == 200)
                        resolve(res.text());

                    return res.json();
                })
                .subscribe(() => {
                    resolve();
                }, error => reject(error));
        });
    }

    updateCustomer(customer: Customer, token: Token): Observable<Customer> {
        let url = `${environment.API_CUSTOMER}/customers`;
        return this.client.put(url, customer, token)
            .map(res => res.json())
    }

    recoverPassword(cpf_cnpj: string, email: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let url = `${environment.API_CUSTOMER}/customers/${cpf_cnpj}/${email}`;
            this.client.put(url, null)
                .map(res => {
                    if (res.status == 200) {
                        resolve(res.text());
                    }
                    else {
                        reject(res.text());
                    }
                    return res.json();
                })
                .subscribe(response => {
                    resolve(response);
                }, error => reject(error));
        });
    }
}