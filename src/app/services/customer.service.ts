import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HttpClient} from '../helpers/httpclient'
import {Title} from '@angular/platform-browser';
import {AppSettings} from 'app/app.settings';
import {NgProgressService} from 'ngx-progressbar';
import {Customer} from '../models/customer/customer';
import {CustomerAddress}  from '../models/customer/customer-address';
import {Login} from '../models/customer/login';
import {Token} from '../models/customer/token';

@Injectable()
export class CustomerService{
    private token: Token;

    constructor(
        private titleService: Title,
        private client: HttpClient,
        private loaderService: NgProgressService
    ){}

    public createCustomer(customer: Customer): Promise<Customer>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CUSTOMER}/customers`;
            this.client.post(url, customer)
                .map(res => res.json())
                .subscribe(new_customer => {
                    resolve(new Customer(new_customer));
                }, error => reject(error));
        });
    }

    public login(user, password): Promise<Customer>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_AUTHENTICATE}/authenticate/login`;
            this.client.post(url, new Login(user, password))
                .map(res => res.json())
                .subscribe(authenticate => {
                    let user = new Customer(authenticate.customer);
                    this.setToken(authenticate, user);
                    resolve(user);
                }, error => reject(error));

        });
    }

    public logout(){
        localStorage.removeItem('customer');
        localStorage.removeItem('customer_mail');
        localStorage.removeItem('auth');
        localStorage.removeItem('auth_create');
        localStorage.removeItem('auth_expires');
    }

    public getUserFromStorage(): Promise<Customer>{
        return new Promise((resolve, reject) => {
            if(this.hasToken){
                let user = new Customer();
                user.firstname_Companyname = localStorage.getItem('customer');
                user.email = localStorage.getItem('customer_mail');
                resolve(user);
            }
            else{
                reject('Usuário não logado');
            }
        })
    }

    public updateUserOnStorage(customer: Customer): Promise<Customer>{
        return new Promise((resolve, reject) => {
            if(this.hasToken){
                localStorage.setItem('customer', customer.firstname_Companyname);
                localStorage.setItem('customer_mail', customer.email);
                resolve(customer);
            }
            else{
                reject('Não foi possível atualizar');
            }
        })
    }

    private getToken(){
        this.token = new Token();
        this.token.accessToken = localStorage.getItem('auth');
        this.token.createdDate = new Date(localStorage.getItem('auth_create'));
        this.token.expiresIn = Number(localStorage.getItem('auth_expires'));
        this.token.tokenType = 'Bearer';
    }

    private setToken(authenticate: any, user: Customer){
        this.token = new Token();
        this.token.accessToken = authenticate.accessToken;
        this.token.tokenType = authenticate.tokenType;
        this.token.createdDate = authenticate.createdDate;
        this.token.expiresIn = authenticate.expiresIn;

        localStorage.setItem('customer', user.firstname_Companyname);
        localStorage.setItem('customer_mail', user.email);
        localStorage.setItem('auth', this.token.accessToken);
        localStorage.setItem('auth_create', this.token.createdDate.toString());
        localStorage.setItem('auth_expires', this.token.expiresIn.toString());
    }

    public hasToken(): boolean{
        if(localStorage.getItem('auth')) return true;
        else return false;
    }

    public getUser(): Promise<Customer>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CUSTOMER}/customers`;
            this.getToken();
            this.client.get(url, this.token)
                .map(res => res.json())
                .subscribe(u => {
                    let customer = new Customer(u);
                    resolve(customer);
                }, error => reject(error));
        });
    }

    public saveAddress(address: CustomerAddress): Promise<CustomerAddress>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CUSTOMER}/customers/address`;
            this.getToken();
            this.client.post(url, address, this.token)
                .map(res => res.json())
                .subscribe(response => {
                    resolve(new CustomerAddress(response));
                }, error => reject(error))
        });
    }

    public updateAddress(address: CustomerAddress): Promise<CustomerAddress>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CUSTOMER}/customers/address`;
            this.getToken();
            this.client.put(url, address, this.token)
                .map(res => res.json())
                .subscribe(response => {
                    resolve(new CustomerAddress(response));
                }, error => reject(error))
        });
    }

    public deleteAddress(addressId): Promise<{}>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CUSTOMER}/customers/${addressId}`;
            this.getToken();
            this.client.delete(url, this.token)
                .map(res => {
                    if(res.status == 200)
                        resolve(res.text());

                    return res.json();
                })
                .subscribe(() => {
                    resolve();
                }, error => reject(error));
        });
    }

    public updateCustomer(customer: Customer): Promise<Customer>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CUSTOMER}/customers`;
            this.getToken();
            this.client.put(url, customer, this.token)
                .map(res => res.json())
                .subscribe((response) => {
                    resolve(new Customer(response));
                }, error => reject(error));
        });
    }

    public recoverPassword(cpf_cnpj: string, email: string): Promise<string>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_CUSTOMER}/customers/${cpf_cnpj}/${email}`;
            this.client.put(url, null)
                .map(res => {
                    if(res.status == 200){
                        resolve(res.text());
                    }
                    else{
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