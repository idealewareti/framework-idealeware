import { Component, OnInit, Input } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { AppCore } from '../../../app.core';
import { CartItem } from '../../../models/cart/cart-item';
import { Sku } from '../../../models/product/sku';
import { Store } from '../../../models/store/store';
import { CartManager } from '../../../managers/cart.manager';
import { Cart } from '../../../models/cart/cart';

declare var swal: any;
declare var toastr: any;

@Component({
    selector: 'mini-cart',
    templateUrl: '../../../templates/home/mini-cart/mini-cart.html',
    styleUrls: ['../../../templates/home/mini-cart/mini-cart.scss']
})
export class MiniCartComponent implements OnInit {

    @Input() store: Store;
    cart: Cart = null;
    mediaPath: string;
    modality: number = -1;
    showValuesProduct: boolean = false;

    constructor(
        private cartManager: CartManager,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.mediaPath = `${this.store.link}/static/products/`;
            this.modality = this.store.modality;
            this.showValuesProduct = this.showValues(this.store);
            this.getCart();
        }
    }

    isCart(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return this.cart != null;
        }
    }

    getCart(): void {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.cartManager.haveCart()) {
                this.cartManager.loadCart()
                    .subscribe(() => { });
            }
            this.cartManager.getCart()
                .subscribe(cart => this.cart = cart
                    , error => { throw new Error(`${error.error} Status: ${error.status}`) });
        }
    }

    updateItem(quantity, item: CartItem): void {
        if (isPlatformBrowser(this.platformId)) {
            let cartId: string = localStorage.getItem('cart_id');
            item.quantity = quantity;
            this.cartManager.updateItem(item, cartId)
                .subscribe(cart => this.cart = cart, e =>
                    swal("Falha ao atualizar o produto ao carrinho", e.text(), "warning"));
        }
    }

    deleteItem(event, item: CartItem): void {
        if (isPlatformBrowser(this.platformId)) {
            event.preventDefault();
            let cartId: string = localStorage.getItem('cart_id');
            this.cartManager.deleteItem(item, cartId)
                .subscribe(() => { }, e => swal("Falha ao remover o produto ao carrinho", e.text(), "warning"));
        }
    }

    getDiscount(): number {
        if (isPlatformBrowser(this.platformId)) {
            return (this.cart) ? this.cart.totalDiscountPrice : 0.0;
        }
    }

    getShipping(): number {
        if (isPlatformBrowser(this.platformId)) {
            return (this.cart) ? this.cart.totalFreightPrice : 0.0;
        }
    }

    getSubTotal(): number {
        if (isPlatformBrowser(this.platformId)) {
            return (this.cart) ? this.cart.totalProductsPrice + this.cart.totalServicesPrice : 0.0;
        }
    }

    getTotal(): number {
        if (isPlatformBrowser(this.platformId)) {
            return (this.cart) ? this.cart.totalPurchasePrice : 0.0;
        }
    }

    getNumItemsInCart(): number {
        if (isPlatformBrowser(this.platformId)) {
            if (this.cart) {
                let numItems = 0;
                numItems += (this.cart.products) ? this.cart.products.length : 0;
                numItems += (this.cart.services) ? this.cart.services.length : 0;
                return numItems;
            }
            return 0;
        }
    }

    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId))
            return AppCore.isMobile(window);
        return false;
    }

    showValues(store): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (this.store && this.modality == 1)
                return true;
            else if (this.store && this.modality == 0 && store.settings.find(s => s.type == 3 && s.status == true))
                return true;
        }
    }

    getRoute(item: CartItem): string {
        if (isPlatformBrowser(this.platformId)) {
            return `/${AppCore.getNiceName(item.name)}-${item.sku.id}`;
        }
    }

    getPicture(sku: Sku): string {
        if (isPlatformBrowser(this.platformId)) {
            if (this.store && sku.picture && sku.picture['showcase'])
                return `${this.store.link}/static/products/${sku.picture.thumbnail}`;
            return 'assets/images/no-image.jpg';
        }

    }
}