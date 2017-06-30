import { Component, OnInit } from '@angular/core';
import { Cart } from "app/models/cart/cart";
import { Customer } from "app/models/customer/customer";
import { ActivatedRoute, Router } from "@angular/router";
import { Http } from "@angular/http";
import { Title } from "@angular/platform-browser";
import { CartManager } from "app/managers/cart.manager";
import { CustomerService } from "app/services/customer.service";
import { CartService } from "app/services/cart.service";
import { StoreService } from "app/services/store.service";
import { AppSettings } from "app/app.settings";
import { BudgetService } from "app/services/budget.service";

declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'budget',
    templateUrl: '../../views/budget.component.html',
    styleUrls: ['../../styles/budget.component.css']
})
export class BudgetComponent implements OnInit {
    private cart: Cart;
    logged: boolean = false;
    private customer: Customer;
    private customer_ip = {};
    private readonly mediaPath = AppSettings.MEDIA_PATH + "/products/"

    constructor(
        private route:ActivatedRoute,
        private parentRouter: Router, 
        private http: Http, 
        private titleService: Title,
        private manager: CartManager,
        private customerService: CustomerService,
        private cartService: CartService,
        private storeService: StoreService,
        private service: BudgetService,
    ) { }

    ngOnInit() { 
        this.storeService.getInfo()
        .then(store => {
            if(store.modality == 1){
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

        this.manager.getCart()
        .then(response => {
            AppSettings.setTitle('Finalização da Compra', this.titleService);
            this.cart = response;
            if(this.cart.products.length == 0){
                this.parentRouter.navigateByUrl('/');
            }
        })
        .catch(error => {
            console.log(error);
            this.parentRouter.navigateByUrl('/');
        });
    }

    private getCustomer() : Promise<Customer>{
        return new Promise((resolve, reject) => {
            if(this.logged) {
                resolve(this.customer);
            }
            
            else{
                this.customerService.getUser()
                .then(customer => {
                    this.customer = customer;
                    this.logged = true;
                    resolve(customer);
                })
                .catch((error) => {
                    this.logged = false;
                    reject(error);
                });
            }
        });
    }

    public placeOrder(event){
        event.preventDefault();
        let cartId = localStorage.getItem('cart_id');
        this.service.createBudget(cartId)
        .then(budget => {
            localStorage.removeItem('cart_id');
            this.parentRouter.navigateByUrl(`/orcamento/concluido/${budget.numberBudget}`);
        })
        .catch(error => {
            swal({
                    title: 'Erro ao criar o orçamento',
                    text: error._body,
                    type: 'error',
                    confirmButtonText: 'OK'
                });
                console.log(error);
        })
    }
}