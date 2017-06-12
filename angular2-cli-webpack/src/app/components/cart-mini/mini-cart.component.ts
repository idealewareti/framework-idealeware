import { Component, AfterViewChecked, OnInit, AfterContentChecked, OnChanges, SimpleChange, Input } from '@angular/core';
import { AppSettings } from 'app/app.settings';
import { Cart } from 'app/models/cart/cart';
import { CartItem } from 'app/models/cart/cart-item';
import { CartManager } from 'app/managers/cart.manager';
import { ProductService } from 'app/services/product.service';
import { StoreService } from "app/services/store.service";

//declare var $: any;
declare var S: any;
declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'mini-cart',
    templateUrl: '../../views/mini-cart.component.html',
})
export class MiniCartComponent {
    public readonly mediaPath = `${AppSettings.MEDIA_PATH}/products/`;
    cartReady: boolean = false;
    cart: Cart;
    modality: number = -1;
    showValuesProduct: boolean = false;

    constructor(private manager: CartManager, private productService: ProductService, private storeService: StoreService) {
    }

    ngOnInit() {
        this.storeService.getInfo()
            .then(store => {
                this.modality = store.modality;
                this.showValuesProduct = this.showValues(store);
            });
        this.getProducts();
    }


    ngAfterContentChecked() {

    }

    public getCart() {
        return this.cart;
    }

    getProducts() {
        this.manager.getCart()
            .then((cart) => {
                this.cartReady = true;
                this.cart = cart;
                setInterval(() => {
                    if (localStorage.getItem('shopping_cart'))
                        this.cart = JSON.parse(localStorage.getItem('shopping_cart'));
                    else this.cart = null;
                }, 5000);
            })
            .catch(e => console.log(e));
    }

    updateItem(quantity, item: CartItem) {
        item.quantity = quantity;
        this.manager.updateItem(item)
            .then(cart => this.cart = cart)
            .catch(error => {
                swal({
                    title: "Falha ao atualizar o produto ao carrinho",
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
            });
    }

    getDiscount() {
        return (this.cart) ? this.cart.totalDiscountPrice : 0.0;
    }

    getShipping() {
        return (this.cart) ? this.cart.totalFreightPrice : 0.0;
    }

    getSubTotal() {
        return (this.cart) ? this.cart.totalProductsPrice : 0.0;
    }

    getTotal() {
        return (this.cart) ? this.cart.totalPurchasePrice : 0.0;
    }

    getNumItemsInCart() {
        return (this.cart) ? this.cart.products.length : 0;

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
}