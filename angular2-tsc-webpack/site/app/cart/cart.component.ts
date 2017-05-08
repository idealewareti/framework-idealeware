import { Component, AfterViewChecked, AfterContentChecked, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '../httpclient'
import { RouterModule } from '@angular/router';
import { AppSettings } from '../app.settings';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../_models/product/product';
import { Sku } from '../_models/product/sku';
import { Cart } from '../_models/cart/cart';
import { CartItem } from '../_models/cart/cart-item';
import { CartManager } from '../_managers/cart.manager';
import { ProductService } from '../_services/product.service';
import { StoreService } from "../_services/store.service";
import { Service } from "../_models/product-service/product-service";

//declare var $: any;
declare var S: any;
declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'cart',
    templateUrl: '/views/cart.component.html',
})
export class CartComponent {
    public readonly mediaPath = `${AppSettings.MEDIA_PATH}/products/`;
    cartReady: boolean = false;
    private cart: Cart;
    buttonLabel: string;
    modality: number = -1;

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
                    this.cart = JSON.parse(localStorage.getItem('shopping_cart'));
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
        return this.cart.products.length;
    }

    getTotalService(): number {
        return this.cart.totalServicesPrice;
    }

    isMobile(): boolean{
        return AppSettings.isMobile();
    }

}

