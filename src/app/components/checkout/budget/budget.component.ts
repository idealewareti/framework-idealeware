import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Cart } from "../../../models/cart/cart";
import { Customer } from "../../..//models/customer/customer";
import { ActivatedRoute, Router } from "@angular/router";
import { Http } from "@angular/http";
import { Title } from "@angular/platform-browser";
import { CartManager } from "../../..//managers/cart.manager";
import { CustomerService } from "../../..//services/customer.service";
import { CartService } from "../../..//services/cart.service";
import { BudgetService } from "../../..//services/budget.service";
import { Sku } from "../../..//models/product/sku";
import { Globals } from "../../..//models/globals";
import { Token } from '../../../models/customer/token';
import { isPlatformBrowser } from '@angular/common';
import { Store } from '../../../models/store/store';
import { Budget } from '../../../models/budget/budget';
import { StoreManager } from '../../../managers/store.manager';

declare var swal: any;
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'app-budget',
    templateUrl: '../../../template/checkout/budget/budget.html',
    styleUrls: ['../../../template/checkout/budget/budget.scss']
})
export class BudgetComponent implements OnInit {
    private cart: Cart;
    logged: boolean = false;
    private customer: Customer;
    private customer_ip = {};
    mediaPath: string;

    constructor(
        private route: ActivatedRoute,
        private parentRouter: Router,
        private http: Http,
        private titleService: Title,
        private manager: CartManager,
        private customerService: CustomerService,
        private storeManager: StoreManager,
        private service: BudgetService,
        private globals: Globals,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) { }

    ngOnInit() {
        this.mediaPath = `${this.globals.store.link}/static/products/`;
        let cartId = localStorage.getItem('cart_id');
        this.storeManager.getStore()
            .then(store => {
                if (store.modality == 1) {
                    this.parentRouter.navigateByUrl('/checkout');
                }
                else
                    return this.getCustomer();
            })
            .then(customer => {
                this.customer_ip = JSON.parse(localStorage.getItem('customer_ip'));
            })
            .catch(error => {
                console.log(error);
                this.parentRouter.navigateByUrl('/');
            });

        this.manager.getCart(cartId)
            .then(response => {
                this.titleService.setTitle('Finalização da Compra');
                this.cart = response;
                if (this.isCartEmpty(this.cart)) {
                    this.parentRouter.navigateByUrl('/');
                }
            })
            .catch(error => {
                console.log(error);
                this.parentRouter.navigateByUrl('/');
            });
    }

    private getToken(): Token {
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

    private getCustomer(): Promise<Customer> {
        return new Promise((resolve, reject) => {
            if (this.logged) {
                resolve(this.customer);
            }
            else {
                let token = this.getToken();
                this.customerService.getUser(token)
                    .subscribe(customer => {
                        this.customer = customer;
                        this.logged = true;
                        resolve(customer);
                    }), ((error) => {
                        this.logged = false;
                        reject(error);
                    });
            }
        });
    }

    placeOrder(event) {
        if (isPlatformBrowser(this.platformId)) {
            event.preventDefault();
            $('.btn-checkout').button('loading');
            let cartId = localStorage.getItem('cart_id');
            let token = this.getToken();
            this.manager.setCustomerToCart(cartId)
                .then(cart => {
                    this.globals.cart = cart;
                    return this.service.createBudget(cartId, token)
                        .subscribe(budget => {
                            localStorage.removeItem('cart_id');
                            this.globals.cart = null;
                            this.parentRouter.navigateByUrl(`/orcamento/concluido/${budget.numberBudget}`);
                        }
                        )
                })
                .catch(error => {
                    $('.btn-checkout').button('reset');
                    swal({
                        title: 'Erro ao criar o orçamento',
                        text: error.text(),
                        type: 'error',
                        confirmButtonText: 'OK'
                    });
                    console.log(error);
                });
        }
    }

    isCartEmpty(cart: Cart): boolean {
        let empty = true;

        if (cart.products && this.cart.products.length == 0)
            empty = false;

        if (cart.paints && this.cart.paints.length == 0)
            empty = false;

        return empty;
    }


    hasPicture(sku: Sku): boolean {
        if (sku.picture['thumbnail'])
            return true;
        else return false;
    }
}
