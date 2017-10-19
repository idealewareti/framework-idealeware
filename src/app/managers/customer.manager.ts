import { Injectable } from "@angular/core";
import { CustomerService } from "app/services/customer.service";
import { Login } from "app/models/customer/login";
import { CartManager } from "app/managers/cart.manager";
import { Customer } from "app/models/customer/customer";
import { Globals } from "app/models/globals";

@Injectable()
export class CustomerManager{

    constructor(
        private service: CustomerService, 
        private cartManager: CartManager,
        private globals: Globals
    ){}

    /**
     * Realiza o login do cliente na loja
     * 
     * @param {Login} login Dados de login (E-mail/CPF e Senha)
     * @returns {Promise<Customer>} 
     * @memberof CustomerManager
     */
    signIn(login: Login): Promise<Customer>{
        let customer: Customer = new Customer();
        return new Promise((resolve, reject) => {
            this.service.login(login.cpfEmail, login.password)
            .then(response => {
                customer = response;
                let cartId: string = localStorage.getItem('cart_id');
                if(!cartId){
                    resolve(customer)
                }
                else{
                    this.cartManager.setCustomerToCart()
                    .then(cart => {
                        this.globals.cart = cart;
                    });
                    resolve(customer)
                }
            })
            .catch(error => {
                reject(error);
            });

        })
        
    }

    /**
     * Realiza o cadastro do cliente e já loga o mesmo
     * 
     * @param {Customer} customer 
     * @returns {Promise<Customer>} 
     * @memberof CustomerManager
     */
    signUp(customer: Customer): Promise<Customer>{
        return new Promise((resolve, reject) => {
            this.service.createCustomer(customer)
            .then(response => {
                let login: Login = new Login(customer.email, customer.password);
                return this.signIn(login);
            })
            .then(loggedCustomer => {
                resolve(loggedCustomer);
            })
            .catch(error => {
                reject(error);
            });
        })

    }

    logOff(){

    }

    getUser(): Promise<Customer>{
        return this.service.getUser();
    }


}