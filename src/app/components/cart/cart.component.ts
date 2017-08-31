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
import { Globals } from "app/models/globals";
import { Store } from "app/models/store/store";

//declare var $: any;
declare var S: any;
declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'cart',
    templateUrl: '../../views/cart.component.html',
})
export class CartComponent {
    mediaPath: string;
    mediaPathPaint: string;
    cartReady: boolean = false;
    buttonLabel: string;
    modality: number = -1;
    showProductValue: boolean = false;

    constructor(
        private manager: CartManager,
        private productService: ProductService,
        private titleService: Title,
        private globals: Globals
    ) {
        window.scrollTo(0, 0); // por causa das hash urls
    }

    ngOnInit() {
        this.mediaPath = `${this.globals.store.link}/static/products/`;
        this.mediaPathPaint = `${this.globals.store.link}/static/custompaint/`;

        this.manager.getCart()
        .then((cart) => {
            this.globals.cart = cart;
            this.cartReady = true;
            setInterval(() => {
                let c = new Cart(JSON.parse(localStorage.getItem('shopping_cart')));
                if(this.globals.cart && (c.totalPurchasePrice != this.globals.cart.totalPurchasePrice))
                    this.globals.cart = c;
            }, 3000);
        })
        .catch(e => console.log(e));

    }

    ngAfterContentChecked() {
        if (this.globals.cart)
            AppSettings.setTitle(`Meu Carrinho - (${this.getNumItemsInCart()}) item(ns)`, this.titleService);
        if(this.getStore() && this.modality == -1){
            this.modality = this.globals.store.modality;
            this.showProductValue = this.showValues();
            if (this.modality == 0)
                this.buttonLabel = 'FINALIZAR ORÇAMENTO';
            else
                this.buttonLabel = 'FINALIZAR COMPRA';
        }
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
            .then(cart => this.globals.cart = cart)
            .catch(error => {
                swal({
                    title: "Falha ao adicionar o produto ao carrinho",
                    text: error.text(),
                    type: "warning",
                    confirmButtonText: "OK"
                });
            });

    }

    updateItemService(quantity, item: Service) {
        item.quantity = quantity;
        this.manager.updateItemService(item)
            .then(cart => this.globals.cart = cart)
            .catch(error => {
                swal({
                    title: "Falha ao alterar ao carrinho",
                    text: error.text(),
                    type: "warning",
                    confirmButtonText: "OK"
                });
            });

    }

    updatePaint(quantity, item: CartItem){
        item.quantity = quantity;
        this.manager.updatePaint(item)
            .then(cart => this.globals.cart = cart)
            .catch(error => {
                swal({
                    title: "Falha ao alterar ao carrinho",
                    text: error.text(),
                    type: "warning",
                    confirmButtonText: "OK"
                });
            });
    }

    deleteItem(event, item: CartItem) {
        event.preventDefault();
        this.manager.deleteItem(item)
            .then(cart => this.globals.cart = cart)
            .catch(error => {
                swal({
                    title: "Falha ao remover o produto do carrinho",
                    text: error.text(),
                    type: "warning",
                    confirmButtonText: "OK"
                });
            })
    }

    deleteItemService(event, item: Service) {
        event.preventDefault();
        this.manager.deleteService(item.id)
            .then(cart => this.globals.cart = cart)
            .catch(error => {
                swal({
                    title: "Falha ao remover o serviço do carrinho",
                    text: error.text(),
                    type: "warning",
                    confirmButtonText: "OK"
                });
            })
    }

     deletePaint(event, item: CartItem) {
        event.preventDefault();
        this.manager.deletePaint(item)
            .then(cart => this.globals.cart = cart)
            .catch(error => {
                swal({
                    title: "Falha ao remover a tinta do carrinho",
                    text: error.text(),
                    type: "warning",
                    confirmButtonText: "OK"
                });
            })
    }

    handleCartUpdated(event) {
        this.globals.cart =  new Cart(event);
    }

    getDiscount() {
        return this.globals.cart.totalDiscountPrice;
    }

    getShipping() {
        return this.globals.cart.totalFreightPrice;
    }

    getSubTotal() {
        return this.globals.cart.totalProductsPrice + this.globals.cart.totalServicesPrice + this.globals.cart.totalCustomPaintPrice;
    }

    getTotal() {
        return (this.globals.cart) ? this.globals.cart.totalPurchasePrice : 0;
    }

    getNumItemsInCart() {
        if(this.globals.cart){
            let numItems = 0;
            numItems += (this.globals.cart['products']) ? this.globals.cart.products.length : 0;
            numItems += (this.globals.cart['services']) ? this.globals.cart.services.length : 0;
            numItems += (this.globals.cart['paints']) ? this.globals.cart.paints.length : 0;
            
            return  numItems;
        }
        else return 0;
    }

    getNumProductsInCart(){
        if(this.globals.cart)
            return this.globals.cart.products.length;
        else return 0;
    }

    getNumServicesInCart(){
        if(this.globals.cart)
            return this.globals.cart.services.length;
        else return 0;
    }

    getNumPaintsInCart(){
        if(this.globals.cart)
            return this.globals.cart.paints.length;
        else return 0;
    }

    getTotalService(): number {
        if(this.globals.cart)
            return this.globals.cart.totalServicesPrice;
        else return 0;
    }

    isMobile(): boolean {
        return AppSettings.isMobile();
    }

    showValues(): boolean {
        if (this.modality == 1) {
            return true;
        }
        else if (this.modality == 0 && this.globals.store.settings.find(s => s.type == 3 && s.status == true)) {
            return true;
        }
        else return false;
    }

    hasServices(): boolean{
        if(this.globals.cart){
            if(this.globals.cart.services && this.globals.cart.services.length > 0)
                return true;
            else return false;
        }
        else return false;
    }

    isCatalog(): boolean{
        if(this.modality == 0)
            return true;
        else return false;
    }

    getCart(): Cart{
        return this.globals.cart;
    }

    getStore(): Store{
        return this.globals.store;
    }

}

