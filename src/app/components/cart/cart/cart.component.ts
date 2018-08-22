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
        this.getStore()
            .then(() => {
                return this.getCart()
            })
            .then(() => {
                this.initComponent();
            })
    }

    getStore(): Promise<Store> {
        return new Promise(resolve => {
            this.storeManager.getStore()
                .subscribe(store => {
                    this.store = store;
                    this.mediaPath = `${this.store.link}/static/products/`;
                    resolve(store);
                })
        })
    }

    getCart(): Promise<Cart> {
        return new Promise(resolve => {
            this.cartManager.getCart()
                .subscribe(cart => {
                    this.cart = cart;
                    this.shipping = cart.shipping;
                    this.cartReady = true;
                    resolve(cart);
                });
        })
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
        if (this.cart)
            return this.cart.products;
    }

    updateItem(quantity, item: CartItem): void {
        let cartId = localStorage.getItem('cart_id');
        item.quantity = quantity;
        this.cartManager.updateItem(item, cartId)
            .subscribe(cart => this.cart = cart, err => swal("Falha ao adicionar o produto ao carrinho", err.error, "warning"));
    }

    updateIsPackageItem(isPackageProduct, item: CartItem): void {
        item.isPackageProduct = isPackageProduct;
        item.sku.isPackageProduct = isPackageProduct;
        this.cartManager.updateIsPackageItem(item, this.cartManager.getCartId())
            .subscribe(() => { }, err => swal("Falha ao adicionar o produto ao carrinho", err.error, "warning"));
    }

    updateItemService(quantity, item: Service): void {
        item.quantity = quantity;
        this.cartManager.updateItemService(item, this.cartManager.getCartId())
            .subscribe(() => { }, err => swal("Falha ao alterar ao carrinho", err.error, "warning"));
    }

    deleteItem(item: CartItem): void {
        this.cartManager.deleteItem(item, this.cartManager.getCartId())
            .subscribe(() => { }, err => swal("Falha ao remover o produto do carrinho", err.error, "warning"));
    }

    deleteItemService(item: Service): void {
        this.cartManager.deleteService(item.id, this.cartManager.getCartId())
            .subscribe(() => { }, err => swal("Falha ao remover o serviço do carrinho", err.error, "warning"));
    }

    handleCartUpdated(cart: Cart): void {
        this.shipping = cart.shipping;
    }

    getDiscount(): number {
        return this.cart.totalDiscountPrice;
    }

    getExistShipping(): EnumShippingType {
        return this.cart.shipping.shippingType;
    }

    getShipping(): number {
        return this.cart.totalFreightPrice;
    }

    getSubTotal(): number {
        return this.cart.totalProductsPrice + this.cart.totalServicesPrice;
    }

    getTotal(): number {
        return (this.cart) ? this.cart.totalPurchasePrice : 0;
    }

    getNumItemsInCart(): number {
        if (this.cart) {
            let numItems = 0;
            numItems += (this.cart['products']) ? this.cart.products.length : 0;
            numItems += (this.cart['services']) ? this.cart.services.length : 0;

            return numItems;
        }
        else return 0;
    }

    getNumProductsInCart(): number {
        if (this.cart)
            return this.cart.products.length;
        else return 0;
    }

    getNumServicesInCart(): number {
        if (this.cart)
            return this.cart.services.length;
        else return 0;
    }

    getTotalService(): number {
        if (this.cart)
            return this.cart.totalServicesPrice;
        else return 0;
    }

    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId))
            return AppCore.isMobile(window);
        return false;
    }

    showValues(): boolean {
        if (this.modality == 1) {
            return true;
        }
        else if (this.modality == 0 && this.store.settings.find(s => s.type == 3 && s.status == true)) {
            return true;
        }
        else return false;
    }

    hasServices(): boolean {
        if (this.cart) {
            if (this.cart.services && this.cart.services.length > 0)
                return true;
            else return false;
        }
        else return false;
    }

    isCatalog(): boolean {
        if (this.modality == 0)
            return true;
        else return false;
    }

    isHiddenVariation(): boolean {
        let type = this.store.settings.find(s => s.type == 4);
        if (type)
            return type.status;
        else
            return false;
    }

    isStorePackageActive(): boolean {
        return this.store.settings.find(s => s.type == 8).status;
    }

    getPicture(sku: Sku): string {
        if (sku.picture && sku.picture['showcase']) {
            return `${this.store.link}/static/products/${sku.picture.thumbnail}`;
        }
        else {
            return 'assets/images/no-image.jpg';
        }
    }

    getProductRoute(product: CartItem): string {
        return `/${AppCore.getNiceName(product.name)}-${product.sku.id}`;
    }

    trackById(index, item) {
        return item.id;
    }
}

