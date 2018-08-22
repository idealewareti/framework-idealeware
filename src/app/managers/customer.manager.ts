import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { CustomerService } from "../services/customer.service";
import { Login } from "../models/customer/login";
import { Customer } from "../models/customer/customer";
import { isPlatformBrowser } from "@angular/common";
import { Observable, BehaviorSubject } from "rxjs";
import { Token } from "../models/customer/token";
import { JwtHelperService } from "@auth0/angular-jwt";
import { CustomerAddress } from "../models/customer/customer-address";
import { map } from "../../../node_modules/rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class CustomerManager {

    private customerSubject = new BehaviorSubject<Customer>(null);

    constructor(
        private service: CustomerService,
        private jwtService: JwtHelperService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { this.loadCustomer(); }

    /**
     * Realiza o login do cliente na loja
     * 
     * @param {Login} login Dados de login (E-mail/CPF e Senha)
     * @returns {Observable<Customer>} 
     * @memberof CustomerManager
     */
    signIn(login: Login): Observable<Customer> {
        return this.service.login(login.cpfEmail, login.password)
            .pipe(map(token => {
                this.setToken(token);
                return token.customer;
            }));
    }

    /**
     * Realiza o cadastro do cliente e já loga o mesmo
     * 
     * @param {Customer} customer 
     * @returns {Promise<Customer>} 
     * @memberof CustomerManager
     */
    signUp(customer: Customer): Observable<Customer> {
        return this.service.createCustomer(customer);
    }

    /**
     * Realiza o 
     */
    logOff() {
        if (this.isLoggedIn()) {
            this.customerSubject.next(null);
            localStorage.removeItem('customer');
            localStorage.removeItem('customer_mail');
            localStorage.removeItem('auth');
            localStorage.removeItem('auth_create');
            localStorage.removeItem('auth_expires');
        }
    }

    getUser(): Observable<Customer> {
        return this.service.getUser();
    }

    loadCustomer(): void {
        if (this.isLoggedIn()) {
            let customer: Customer = new Customer();
            customer.firstname_Companyname = localStorage.getItem('customer');
            customer.email = localStorage.getItem('customer_mail');
            this.customerSubject.next(customer);
        }
    }

    /**
	 * Valida se o cliente está logado
	 * @returns {boolean} 
	 * @memberof AppComponent
	 */
    isLoggedIn(): boolean {
        return !this.jwtService.isTokenExpired();
    }

    /**
     * Recupera Senha
     * @param cpf_cnpj 
     * @param email 
     */
    recoverPassword(cpf_cnpj, email) {
        return this.service.recoverPassword(cpf_cnpj, email);
    }

    updateCustomer(customer: Customer): Promise<Customer> {
        return new Promise((resolve, reject) => {
            if (this.isLoggedIn()) {
                this.service.updateCustomer(customer).subscribe(updated_customer => {
                    localStorage.setItem('customer', updated_customer.firstname_Companyname);
                    localStorage.setItem('customer_mail', updated_customer.email);
                    this.customerSubject.next(updated_customer);
                    resolve(updated_customer);
                });
            }
            else {
                reject('Não foi possível atualizar');
            }
        })
    }

    getCustomer(): Observable<Customer> {
        return this.customerSubject.asObservable();
    }

    saveAddress(address: CustomerAddress): Observable<CustomerAddress> {
        return this.service.saveAddress(address);
    }

    updateAddress(address: CustomerAddress): Observable<CustomerAddress> {
        return this.service.updateAddress(address);
    }

    deleteAddress(id: string): Observable<{}> {
        return this.service.deleteAddress(id);
    }

    private setToken(token: Token) {
        if (isPlatformBrowser(this.platformId)) {
            this.customerSubject.next(token.customer);
            localStorage.setItem('customer', token.customer.firstname_Companyname);
            localStorage.setItem('customer_mail', token.customer.email);
            localStorage.setItem('auth', token.accessToken);
            localStorage.setItem('auth_create', token.createdDate.toString());
            localStorage.setItem('auth_expires', token.expiresIn.toString());
        }
    }

    getToken(): Token {
        if (isPlatformBrowser(this.platformId)) {
            let token = new Token();
            if (isPlatformBrowser(this.platformId)) {
                token = new Token();
                token.accessToken = localStorage.getItem('auth');
                token.createdDate = new Date(localStorage.getItem('auth_create'));
                token.expiresIn = Number(localStorage.getItem('auth_expires'));
                token.tokenType = 'Bearer';
            }
            return token;
        }
    }
}