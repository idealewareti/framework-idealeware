import { Component, AfterViewChecked, AfterContentChecked, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../models/product/product';
import { Sku } from '../../../models/product/sku';
import { Cart } from '../../../models/cart/cart';
import { CartItem } from '../../../models/cart/cart-item';
import { CartManager } from '../../../managers/cart.manager';
import { ProductService } from '../../../services/product.service';
import { StoreService } from "../../../services/store.service";
import { Service } from "../../../models/product-service/product-service";
import { Globals } from "../../../models/globals";
import { Store } from "../../../models/store/store";
import { isPlatformBrowser } from '@angular/common';
import { AppCore } from '../../../app.core';
import { error } from 'util';
import { Paint } from '../../../models/custom-paint/custom-paint';
import { Shipping } from '../../../models/shipping/shipping';
import { AppConfig } from '../../../app.config';

//declare var $: any;
declare var S: any;
declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'app-cart',
    templateUrl: '../../../template/cart/cart/cart.html',
    styleUrls: ['../../../template/cart/cart/cart.scss']
})
export class CartComponent {
    mediaPath: string;
    mediaPathPaint: string;
    cartReady: boolean = false;
    buttonLabel: string;
    modality: number = -1;
    showProductValue: boolean = false;
    store: Store;
    shipping: Shipping = null;

    constructor(
        private manager: CartManager,
        private productService: ProductService,
        private storeService: StoreService,
        private titleService: Title,
        private globals: Globals,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0, 0);

            let cartId = localStorage.getItem('cart_id');
            this.fetchStore()
                .then(store => {
                    this.store = store;
                    this.globals.store = store;
                    this.mediaPath = `${this.globals.store.link}/static/products/`;
                    this.mediaPathPaint = `${this.globals.store.link}/static/custompaint/`;
                    return this.manager.getCart(cartId);
                })
                .then((cart) => {
                    this.globals.cart = cart;
                    this.shipping = cart.shipping;
                    this.cartReady = true;
                })
                .catch(e => console.log(e));
        }
    }

    ngAfterContentChecked() {
        if (this.globals.cart)
            this.titleService.setTitle(`Meu Carrinho - (${this.getNumItemsInCart()}) item(ns)`);
        if (this.getStore() && this.modality == -1) {
            this.modality = this.globals.store.modality;
            this.showProductValue = this.showValues();
            if (this.modality == 0)
                this.buttonLabel = 'FINALIZAR ORÇAMENTO';
            else
                this.buttonLabel = 'FINALIZAR COMPRA';
        }
    }

    getProducts() {
        if (isPlatformBrowser(this.platformId)) {
            let cartId = localStorage.getItem('cart_id');
            this.manager.getCart(cartId)
                .then((cart) => {
                    this.cartReady = true;
                })
                .catch(e => console.log(e));
        }
    }

    updateItem(quantity, item: CartItem) {
        if (isPlatformBrowser(this.platformId)) {
            let cartId = localStorage.getItem('cart_id');
            item.quantity = quantity;
            this.manager.updateItem(item, cartId)
                .then(cart => this.globals.cart = cart)
                .catch(error => {
                    swal("Falha ao adicionar o produto ao carrinho", error.text(), "warning");
                });
        }

    }

    updateItemService(quantity, item: Service) {
        if (isPlatformBrowser(this.platformId)) {
            let cartId = localStorage.getItem('cart_id');
            item.quantity = quantity;
            this.manager.updateItemService(item, cartId)
                .then(cart => this.globals.cart = cart)
                .catch(error => {
                    swal("Falha ao alterar ao carrinho", error.text(), "warning");
                });
        }
    }

    updatePaint(quantity, item: CartItem) {
        if (isPlatformBrowser(this.platformId)) {
            let cartId = localStorage.getItem('cart_id');
            item.quantity = quantity;
            this.manager.updatePaint(item, cartId)
                .then(cart => this.globals.cart = cart)
                .catch(error => {
                    swal("Falha ao alterar ao carrinho", error.text(), "warning");
                });
        }
    }

    deleteItem(event, item: CartItem) {
        if (isPlatformBrowser(this.platformId)) {
            let cartId = localStorage.getItem('cart_id');
            event.preventDefault();
            this.manager.deleteItem(item, cartId)
                .then(cart => this.globals.cart = cart)
                .catch(error => {
                    swal("Falha ao remover o produto do carrinho", error.text(), "warning");
                });
        }
    }

    deleteItemService(event, item: Service) {
        if (isPlatformBrowser(this.platformId)) {
            let cartId = localStorage.getItem('cart_id');
            event.preventDefault();
            this.manager.deleteService(item.id, cartId)
                .then(cart => this.globals.cart = cart)
                .catch(error => {
                    swal("Falha ao remover o serviço do carrinho", error.text(), "warning");
                });
        }
    }

    deletePaint(event, item: CartItem) {
        if (isPlatformBrowser(this.platformId)) {
            let cartId = localStorage.getItem('cart_id');
            event.preventDefault();
            this.manager.deletePaint(item, cartId)
                .then(cart => this.globals.cart = cart)
                .catch(error => {
                    swal("Falha ao remover a tinta do carrinho", error.text(), "warning");
                });
        }
    }

    handleCartUpdated(event: Cart) {
        this.shipping = event.shipping;
        this.globals.cart = new Cart(event);
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
        if (this.globals.cart) {
            let numItems = 0;
            numItems += (this.globals.cart['products']) ? this.globals.cart.products.length : 0;
            numItems += (this.globals.cart['services']) ? this.globals.cart.services.length : 0;
            numItems += (this.globals.cart['paints']) ? this.globals.cart.paints.length : 0;

            return numItems;
        }
        else return 0;
    }

    getNumProductsInCart() {
        if (this.globals.cart)
            return this.globals.cart.products.length;
        else return 0;
    }

    getNumServicesInCart() {
        if (this.globals.cart)
            return this.globals.cart.services.length;
        else return 0;
    }

    getNumPaintsInCart() {
        if (this.globals.cart)
            return this.globals.cart.paints.length;
        else return 0;
    }

    getTotalService(): number {
        if (this.globals.cart)
            return this.globals.cart.totalServicesPrice;
        else return 0;
    }

    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;
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

    hasServices(): boolean {
        if (this.globals.cart) {
            if (this.globals.cart.services && this.globals.cart.services.length > 0)
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
        let type = this.globals.store.settings.find(s => s.type == 4);
        if (type)
            return type.status;
        else
            return false;
    }

    getCart(): Cart {
        return this.globals.cart;
    }

    getStore(): Store {
        return this.store;
    }

    private fetchStore(): Promise<Store> {
        if (isPlatformBrowser(this.platformId)) {
            let store: Store = JSON.parse(sessionStorage.getItem('store'));
            if (store && store.domain == AppConfig.DOMAIN) {
                return new Promise((resolve, reject) => {
                    resolve(store);
                });
            }
        }
        return this.fetchStoreFromApi();
    }

    private fetchStoreFromApi(): Promise<Store> {
        return new Promise((resolve, reject) => {
            this.storeService.getStore()
                .subscribe(response => {
                    if (isPlatformBrowser(this.platformId)) {
                        sessionStorage.setItem('store', JSON.stringify(response));
                    }
                    resolve(response);
                }, error => {
                    reject(error);
                });
        });
    }

    getPicture(sku: Sku): string {
        if (sku.picture && sku.picture['showcase']) {
            return `${this.store.link}/static/products/${sku.picture.thumbnail}`;
        }
        else {
            return 'assets/images/no-image.jpg';
        }
    }

    getPaintPicture(paint: Paint): string {
        if (paint && paint.optionPicture) {
            return `${this.store.link}/static/custompaint/${paint.optionPicture}`;
        }
        else {
            return 'assets/images/no-image.jpg';
        }
    }

    getProductRoute(product: CartItem): string {
        return `/${AppCore.getNiceName(product.name)}-${product.sku.id}`;
    }
}

