import { Component, AfterViewChecked, AfterContentChecked, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from 'app/helpers/httpclient'
import { RouterModule } from '@angular/router';
import { AppSettings } from 'app/app.settings';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'app/models/product/product';
import { Sku } from 'app/models/product/sku';
import { Cart } from 'app/models/cart/cart';
import { CartItem } from 'app/models/cart/cart-item';
import { CartManager } from 'app/managers/cart.manager';
import { ProductService } from 'app/services/product.service';
import { StoreService } from "app/services/store.service";
import { Service } from "app/models/product-service/product-service";

//declare var $: any;
declare var S: any;
declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'cart',
    templateUrl: '../../views/cart.component.html',
})
export class CartComponent {
    public readonly mediaPath = `${AppSettings.MEDIA_PATH}/products/`;
    cartReady: boolean = false;
    cart: Cart = new Cart();
    buttonLabel: string;
    modality: number = -1;
    showValuesProduct: boolean = false;

    constructor(
        private manager: CartManager,
        private productService: ProductService,
        private storeService: StoreService,
        private titleService: Title
    ) {
        window.scrollTo(0, 0); // por causa das hash urls
    }

    ngOnInit() {
        this.storeService.getInfo()
            .then(store => {
                this.modality = store.modality;
                this.showValuesProduct = this.showValues(store);
                if (this.modality == 0)
                    this.buttonLabel = 'FINALIZAR ORÇAMENTO';
                else
                    this.buttonLabel = 'FINALIZAR COMPRA';
            });

        this.manager.getCart()
            .then((cart) => {
                this.cart = cart;
                this.cartReady = true;
                setInterval(() => {
                    let c = new Cart(JSON.parse(localStorage.getItem('shopping_cart')));
                    if(c.totalPurchasePrice != this.cart.totalPurchasePrice)
                        this.cart = c;
                }, 3000);
            })
            .catch(e => console.log(e));

    }

    ngAfterContentChecked() {
        if (this.cart)
            AppSettings.setTitle(`Meu Carrinho - (${this.getNumItemsInCart()}) item(ns)`, this.titleService);
    }

    getProducts() {
        this.manager.getCart()
            .then((cart) => {
                this.cartReady = true;
            })
            .catch(e => console.log(e));
    }

    updateItem(quantity, item: CartItem) {
        item.quantity = quantity;
        this.manager.updateItem(item)
            .then(cart => this.cart = cart)
            .catch(error => {
                swal({
                    title: "Falha ao adicionar o produto ao carrinho",
                    text: error._body,
                    type: "warning",
                    confirmButtonText: "OK"
                });
            });

    }

    updateItemService(quantity, item: Service) {
        item.quantity = quantity;
        this.manager.updateItemService(item)
            .then(cart => this.cart = cart)
            .catch(error => {
                swal({
                    title: "Falha ao alterar ao carrinho",
                    text: error._body,
                    type: "warning",
                    confirmButtonText: "OK"
                });
            });

    }

    deleteItem(event, item: CartItem) {
        event.preventDefault();
        this.manager.deleteItem(item)
            .then(cart => this.cart = cart)
            .catch(error => {
                swal({
                    title: "Falha ao remover o produto ao carrinho",
                    text: error._body,
                    type: "warning",
                    confirmButtonText: "OK"
                });
            })
    }

    deleteItemService(event, item: Service) {
        event.preventDefault();
        this.manager.deleteService(item.id)
            .then(cart => this.cart = cart)
            .catch(error => {
                swal({
                    title: "Falha ao remover o serviço do carrinho",
                    text: error._body,
                    type: "warning",
                    confirmButtonText: "OK"
                });
            })
    }

    handleCartUpdated(event) {
        this.cart = event;
    }

    getDiscount() {
        return this.cart.totalDiscountPrice;
    }

    getShipping() {
        return this.cart.totalFreightPrice;
    }

    getSubTotal() {
        return this.cart.totalProductsPrice;
    }

    getTotal() {
        return this.cart.totalPurchasePrice;
    }

    getNumItemsInCart() {
        if(this.cart)
            return this.cart.products.length;
        else return 0;
    }

    getTotalService(): number {
        if(this.cart)
            return this.cart.totalServicesPrice;
        else return 0;
    }

    isMobile(): boolean {
        return AppSettings.isMobile();
    }

    showValues(store): boolean {
        if (this.modality == 1) {
            return true;
        }
        else if (this.modality == 0 && store.settings.find(s => s.type == 3 && s.status == true)) {
            return true;
        }
    }

    hasServices(): boolean{
        if(this.cart){
            if(this.cart.services && this.cart.services.length > 0)
                return true;
            else return false;
        }
        else return false;
    }

}

