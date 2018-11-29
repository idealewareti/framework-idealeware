import { Component, PLATFORM_ID, Inject, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { Sku } from '../../../models/product/sku';
import { Cart } from '../../../models/cart/cart';
import { CartItem } from '../../../models/cart/cart-item';
import { CartManager } from '../../../managers/cart.manager';
import { Service } from "../../../models/product-service/product-service";
import { Store } from "../../../models/store/store";
import { AppCore } from '../../../app.core';
import { Shipping } from '../../../models/shipping/shipping';
import { StoreManager } from '../../../managers/store.manager';
import { EnumShippingType } from '../../../enums/shipping-type.enum';

declare var swal: any;

@Component({
    templateUrl: '../../../templates/cart/cart/cart.html',
    styleUrls: ['../../../templates/cart/cart/cart.scss']
})
export class CartComponent implements OnInit {
    mediaPath: string;
    cartReady: boolean = false;
    buttonLabel: string;
    modality: number = -1;
    showProductValue: boolean = false;
    store: Store;
    shipping: Shipping = null;
    cart: Cart = new Cart();

    constructor(
        private cartManager: CartManager,
        private storeManager: StoreManager,
        private titleService: Title,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.getStore()
                .then(() => {
                    return this.getCart()
                })
                .then(() => {
                    this.initComponent();
                })
        }
    }

    getStore(): Promise<Store> {
        if (isPlatformBrowser(this.platformId)) {
            return new Promise(resolve => {
                this.storeManager.getStore()
                    .subscribe(store => {
                        this.store = store;
                        this.mediaPath = `${this.store.link}/static/products/`;
                        resolve(store);
                    })
            })
        }
    }

    getCart(): Promise<Cart> {
        if (isPlatformBrowser(this.platformId)) {
            return new Promise(resolve => {
                this.cartManager.getCart()
                    .subscribe(cart => {
                        this.cart = cart;
                        this.shipping = cart.shipping;
                        this.cartReady = true;
                        resolve(cart);
                    }, error => {
                        swal('Não foi possível recuperar o carrinho', 'error');
                        throw new Error(`${error.error} Status: ${error.status}`);
                    });
            })
        }
    }

    initComponent(): void {
        if (isPlatformBrowser(this.platformId)) {
            if (this.cart)
                this.titleService.setTitle(`Meu Carrinho - (${this.getNumItemsInCart()}) item(ns)`);
            if (this.store && this.modality == -1) {
                this.modality = this.store.modality;
                this.showProductValue = this.showValues();
                if (this.modality == 0)
                    this.buttonLabel = 'FINALIZAR ORÇAMENTO';
                else
                    this.buttonLabel = 'FINALIZAR COMPRA';
            }
        }
    }

    getProducts(): CartItem[] {
        if (isPlatformBrowser(this.platformId)) {
            if (this.cart)
                return this.cart.products;
        }
    }

    updateItem(quantity, item: CartItem): void {
        if (isPlatformBrowser(this.platformId)) {
            let cartId = localStorage.getItem('cart_id');
            item.quantity = quantity;
            this.cartManager.updateItem(item, cartId)
                .subscribe(cart => this.cart = cart, err => swal("Falha ao adicionar o produto ao carrinho", err.error, "warning"));
        }
    }

    updateIsPackageItem(isPackageProduct, item: CartItem): void {
        if (isPlatformBrowser(this.platformId)) {
            item.isPackageProduct = isPackageProduct;
            item.sku.isPackageProduct = isPackageProduct;
            this.cartManager.updateIsPackageItem(item, this.cartManager.getCartId())
                .subscribe(() => { }, err => swal("Falha ao adicionar o produto ao carrinho", err.error, "warning"));
        }
    }

    updateItemService(quantity, item: Service): void {
        if (isPlatformBrowser(this.platformId)) {
            item.quantity = quantity;
            this.cartManager.updateItemService(item, this.cartManager.getCartId())
                .subscribe(() => { }, err => swal("Falha ao alterar ao carrinho", err.error, "warning"));
        }
    }

    deleteItem(item: CartItem): void {
        if (isPlatformBrowser(this.platformId)) {
            this.cartManager.deleteItem(item, this.cartManager.getCartId())
                .subscribe(() => { }, err => swal("Falha ao remover o produto do carrinho", err.error, "warning"));
        }
    }

    deleteItemService(item: Service): void {
        if (isPlatformBrowser(this.platformId)) {
            this.cartManager.deleteService(item.id, this.cartManager.getCartId())
                .subscribe(() => { }, err => swal("Falha ao remover o serviço do carrinho", err.error, "warning"));
        }
    }

    handleCartUpdated(cart: Cart): void {
        if (isPlatformBrowser(this.platformId)) {
            this.shipping = cart.shipping;
        }
    }

    getDiscount(): number {
        if (isPlatformBrowser(this.platformId)) {
            return this.cart.totalDiscountPrice;
        }
    }

    getExistShipping(): EnumShippingType {
        if (isPlatformBrowser(this.platformId)) {
            return this.cart.shipping.shippingType;
        }
    }

    getShipping(): number {
        if (isPlatformBrowser(this.platformId)) {
            return this.cart.totalFreightPrice;
        }
    }

    getSubTotal(): number {
        if (isPlatformBrowser(this.platformId)) {
            return this.cart.totalProductsPrice + this.cart.totalServicesPrice;
        }
    }

    getTotal(): number {
        if (isPlatformBrowser(this.platformId)) {
            return (this.cart) ? this.cart.totalPurchasePrice : 0;
        }
    }

    getNumItemsInCart(): number {
        if (isPlatformBrowser(this.platformId)) {
            if (this.cart) {
                let numItems = 0;
                numItems += (this.cart['products']) ? this.cart.products.length : 0;
                numItems += (this.cart['services']) ? this.cart.services.length : 0;

                return numItems;
            }
            else return 0;
        }
    }

    getNumProductsInCart(): number {
        if (isPlatformBrowser(this.platformId)) {
            if (this.cart)
                return this.cart.products.length;
            else return 0;
        }
    }

    getNumServicesInCart(): number {
        if (isPlatformBrowser(this.platformId)) {
            if (this.cart)
                return this.cart.services.length;
            else return 0;
        }
    }

    getTotalService(): number {
        if (isPlatformBrowser(this.platformId)) {
            if (this.cart)
                return this.cart.totalServicesPrice;
            else return 0;
        }
    }

    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId))
            return AppCore.isMobile(window);
        return false;
    }

    showValues(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (this.modality == 1) {
                return true;
            }
            else if (this.modality == 0 && this.store.settings.find(s => s.type == 3 && s.status == true)) {
                return true;
            }
            else return false;
        }
    }

    hasServices(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (this.cart) {
                if (this.cart.services && this.cart.services.length > 0)
                    return true;
                else return false;
            }
            else return false;
        }
    }

    isCatalog(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (this.modality == 0)
                return true;
            else return false;
        }
    }

    isHiddenVariation(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            let type = this.store.settings.find(s => s.type == 4);
            if (type)
                return type.status;
            else
                return false;
        }
    }

    isStorePackageActive(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return this.store.settings.find(s => s.type == 8).status;
        }
    }

    getPicture(sku: Sku): string {
        if (isPlatformBrowser(this.platformId)) {
            if (sku.picture && sku.picture['showcase']) {
                return `${this.store.link}/static/products/${sku.picture.thumbnail}`;
            }
            else {
                return 'assets/images/no-image.jpg';
            }
        }
    }

    getProductRoute(product: CartItem): string {
        if (isPlatformBrowser(this.platformId)) {
            return `/${AppCore.getNiceName(product.name)}-${product.sku.id}`;
        }
    }

    trackById(index, item) {
        if (isPlatformBrowser(this.platformId)) {
            return item.id;
        }
    }
}

