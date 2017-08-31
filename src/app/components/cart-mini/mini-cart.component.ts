import { Component, AfterViewChecked, OnInit, AfterContentChecked, OnChanges, SimpleChange, Input } from '@angular/core';
import { AppSettings } from 'app/app.settings';
import { Cart } from 'app/models/cart/cart';
import { CartItem } from 'app/models/cart/cart-item';
import { CartManager } from 'app/managers/cart.manager';
import { ProductService } from 'app/services/product.service';
import { Globals } from "app/models/globals";
import { Sku } from "app/models/product/sku";

declare var S: any;
declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'mini-cart',
    templateUrl: '../../views/mini-cart.component.html',
})
export class MiniCartComponent {
    mediaPath: string;
    mediaPathPaint: string;
    cartReady: boolean = false;
    modality: number = -1;
    showValuesProduct: boolean = false;

    constructor(
        private manager: CartManager,
        private productService: ProductService,
        private globals: Globals) {
    }

    ngOnInit() {
        this.mediaPath = `${this.globals.store.link}/static/products/`;
        this.mediaPathPaint = `${this.globals.store.link}/static/custompaint/`;
        this.modality = this.globals.store.modality;
        this.showValuesProduct = this.showValues(this.globals.store);
        this.getProducts();
    }


    ngAfterContentChecked() {}

    public getCart() {
        return this.globals.cart;
    }

    getProducts() {
        this.manager.getCart()
        .then((cart) => {
            this.cartReady = true;
            this.globals.cart = cart;
        })
        .catch(e => console.log(e));
    }

    updateItem(quantity, item: CartItem) {
        item.quantity = quantity;
        this.manager.updateItem(item)
        .then(cart => this.globals.cart = cart)
        .catch(error => {
            swal({
                title: "Falha ao atualizar o produto ao carrinho",
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
                    title: "Falha ao remover o produto ao carrinho",
                    text: error.text(),
                    type: "warning",
                    confirmButtonText: "OK"
                });
            });
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

    getDiscount(): number {
        return (this.globals.cart) ? this.globals.cart.totalDiscountPrice : 0.0;
    }

    getShipping(): number {
        return (this.globals.cart) ? this.globals.cart.totalFreightPrice : 0.0;
    }

    getSubTotal(): number {
        return (this.globals.cart) ? this.globals.cart.totalProductsPrice + this.globals.cart.totalServicesPrice + this.globals.cart.totalCustomPaintPrice : 0.0;
    }

    getTotal(): number {
        return (this.globals.cart) ? this.globals.cart.totalPurchasePrice : 0.0;
    }

    getNumItemsInCart(): number {
        if(this.globals.cart){
            let numItems = 0;
            numItems += (this.globals.cart.products) ? this.globals.cart.products.length : 0;
            numItems += (this.globals.cart.services) ? this.globals.cart.services.length : 0;
            numItems += (this.globals.cart.paints) ? this.globals.cart.paints.length : 0;
            
            return  numItems;
        }
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

    getRoute(item: CartItem): string{
        return `/${AppSettings.getNiceName(item.name)}-${item.sku.id}`;
    }

	getPicture(sku: Sku): string{
        if(sku.picture && sku.picture['showcase'])
            return `${this.mediaPath}${sku.picture.thumbnail}`
        else return 'assets/images/no-image.jpg';
    }
}