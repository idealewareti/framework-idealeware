import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { CustomerService } from "../../app/services/customer.service";
import { Login } from "../../app/models/customer/login";
import { CartManager } from "../../app/managers/cart.manager";
import { Customer } from "../../app/models/customer/customer";
import { Globals } from "../../app/models/globals";
import { Observable } from "rxjs/Observable";
import { Token } from "../models/customer/token";
import { isPlatformBrowser } from "@angular/common";
import { AppConfig } from "../app.config";
import { Store } from "../models/store/store";

@Injectable()
export class CustomerManager {

    constructor(
        private service: CustomerService,
        private cartManager: CartManager,
        private globals: Globals,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.persistLocalStorage();
     }


    getToken(): Token {
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

    private setToken(authenticate: any, user: Customer) {
        if (isPlatformBrowser(this.platformId)) {
            let token = new Token();
            token.accessToken = authenticate.accessToken;
            token.tokenType = authenticate.tokenType;
            token.createdDate = authenticate.createdDate;
            token.expiresIn = authenticate.expiresIn;

            localStorage.setItem('customer', user.firstname_Companyname);
            localStorage.setItem('customer_mail', user.email);
            localStorage.setItem('auth', token.accessToken);
            localStorage.setItem('auth_create', token.createdDate.toString());
            localStorage.setItem('auth_expires', token.expiresIn.toString());
        }
    }

    private persistLocalStorage() {
        if (isPlatformBrowser(this.platformId)) {
            let store: Store = JSON.parse(sessionStorage.getItem('store'));
            if (store && store.domain != AppConfig.DOMAIN) {
                localStorage.clear();
            }
        }
    }

    hasToken(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (localStorage.getItem('auth')) {
                return true;
            }
            return false;
        }
        else {
            return false;
        }
    }

    private getCartId(): string {
        let cartId: string = null;
        if (isPlatformBrowser(this.platformId)) {
            cartId = localStorage.getItem('cart_id');
        }
        return cartId;
    }

    /**
     * Realiza o login do cliente na loja
     * 
     * @param {Login} login Dados de login (E-mail/CPF e Senha)
     * @returns {Promise<Customer>} 
     * @memberof CustomerManager
     */
    signIn(login: Login): Promise<Customer> {
        let customer: Customer = new Customer();
        return new Promise((resolve, reject) => {
            this.service.login(login.cpfEmail, login.password)
                .then(response => {
                    customer = response.customer;
                    this.setToken(response, response.customer);
                    let cartId: string = this.getCartId();
                    if (!cartId) {
                        resolve(customer);
                    }
                    else {
                        return this.cartManager.setCustomerToCart(cartId)
                    }
                })
                .then(cart => {
                    resolve(customer);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    /**
     * Realiza o cadastro do cliente e já loga o mesmo
     * 
     * @param {Customer} customer 
     * @returns {Promise<Customer>} 
     * @memberof CustomerManager
     */
    signUp(customer: Customer): Promise<Customer> {
        return new Promise((resolve, reject) => {
            this.service.createCustomer(customer)
                .subscribe(response => {
                    let login: Login = new Login(customer.email, customer.password);
                    this.signIn(login)
                        .then(loggedCustomer => {
                            resolve(loggedCustomer);
                        })
                        .catch(error => {
                            reject(error);
                        });
                }, error => reject(error));
        })
    }

    logOff() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('customer');
            localStorage.removeItem('customer_mail');
            localStorage.removeItem('auth');
            localStorage.removeItem('auth_create');
            localStorage.removeItem('auth_expires');
        }
    }

    getUser(): Observable<Customer> {
        let token: Token = this.getToken();
        return this.service.getUser(token);
    }

    updateUserOnStorage(customer: Customer): Promise<Customer> {
        return new Promise((resolve, reject) => {
            if (this.hasToken) {
                localStorage.setItem('customer', customer.firstname_Companyname);
                localStorage.setItem('customer_mail', customer.email);
                resolve(customer);
            }
            else {
                reject('Não foi possível atualizar');
            }
        })
    }

    getUserFromStorage(): Promise<Customer> {
        return new Promise((resolve, reject) => {
            if (this.hasToken) {
                let user = new Customer();
                user.firstname_Companyname = localStorage.getItem('customer');
                user.email = localStorage.getItem('customer_mail');
                resolve(user);
            }
            else {
                reject('Usuário não logado');
            }
        })
    }
}