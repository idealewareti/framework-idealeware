import { Component, OnInit } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Globals } from '../../../models/globals';
import { CartService } from '../../../services/cart.service';
import { AppCore } from '../../../app.core';
import { CartItem } from '../../../models/cart/cart-item';
import { Sku } from '../../../models/product/sku';

declare var swal: any;

@Component({
    selector: 'app-mini-cart',
    templateUrl: '../../../template/home/mini-cart/mini-cart.html',
    styleUrls: ['../../../template/home/mini-cart/mini-cart.scss']
})
export class MiniCartComponent implements OnInit {
    mediaPath: string;
    mediaPathPaint: string;
    cartReady: boolean = false;
    modality: number = -1;
    showValuesProduct: boolean = false;

    constructor(
        private manager: CartService,
        private globals: Globals,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        this.mediaPath = `${this.globals.store.link}/static/products/`;
        this.mediaPathPaint = `${this.globals.store.link}/static/custompaint/`;
        this.modality = this.globals.store.modality;
        this.showValuesProduct = this.showValues(this.globals.store);
        this.getProducts();
     }

     public getCart() {
        return this.globals.cart;
    }

    getProducts() {
        if (isPlatformBrowser(this.platformId)) {
            let cartId: string = localStorage.getItem('cart_id');
            this.manager.getCart(cartId)
            .then((cart) => {
                this.cartReady = true;
                this.globals.cart = cart;
            })
            .catch(e => {
                console.log(e);
            });
        }
    }

    updateItem(quantity, item: CartItem) {
        if (isPlatformBrowser(this.platformId)) {
            let cartId: string = localStorage.getItem('cart_id');
            item.quantity = quantity;
            this.manager.updateItem(item, cartId)
            .then(cart => {
                this.globals.cart = cart;
            })
            .catch(error => {
                swal("Falha ao atualizar o produto ao carrinho", error.text(), "warning");
            });
        }            
    }

    deleteItem(event, item: CartItem) {
        event.preventDefault();
        if (isPlatformBrowser(this.platformId)) {
            let cartId: string = localStorage.getItem('cart_id');
            this.manager.deleteItem(item, cartId)
            .then(cart => this.globals.cart = cart)
            .catch(error => {
                swal("Falha ao remover o produto ao carrinho", error.text(), "warning");
            });
        }            
    }

    deletePaint(event, item: CartItem) {
        event.preventDefault();
        if (isPlatformBrowser(this.platformId)) {
            let cartId: string = localStorage.getItem('cart_id');
            this.manager.deletePaint(item, cartId)
            .then(cart => this.globals.cart = cart)
            .catch(error => {
                swal("Falha ao remover a tinta do carrinho", error.text(), "warning");
            });
        }            
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
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;            
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
        return `/${AppCore.getNiceName(item.name)}-${item.sku.id}`;
    }

	getPicture(sku: Sku): string{
        if(sku.picture && sku.picture['showcase'])
            return `${this.mediaPath}${sku.picture.thumbnail}`
        else return 'assets/images/no-image.jpg';
    }
}