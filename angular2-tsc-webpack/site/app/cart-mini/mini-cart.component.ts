import { Component, AfterViewChecked, OnInit, AfterContentChecked, OnChanges, SimpleChange, Input } from '@angular/core';
import {AppSettings} from '../app.settings';
import {Cart} from '../_models/cart/cart';
import {CartItem} from '../_models/cart/cart-item';
import {CartManager} from '../_managers/cart.manager';
import { ProductService } from '../_services/product.service';

//declare var $: any;
declare var S: any;
declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'mini-cart',
    templateUrl: '/views/mini-cart.component.html',
})
export class MiniCartComponent{
    public readonly mediaPath = `${AppSettings.MEDIA_PATH}/products/`;
    cartReady: boolean = false;
    cart: Cart;

    constructor(private manager: CartManager, private productService: ProductService){
    }

    ngOnInit(){
        this.getProducts();
    }
    

    ngAfterContentChecked(){
        
    }

    public getCart(){
        return this.cart;
    }

    getProducts(){
        this.manager.getCart()
        .then((cart) => {
            this.cartReady = true;
            this.cart = cart;
            setInterval(() => {
                if(localStorage.getItem('shopping_cart'))
                    this.cart = JSON.parse(localStorage.getItem('shopping_cart'));
                else this.cart = null;
            }, 5000);
        })
        .catch(e => console.log(e));
    }

    updateItem(quantity, item: CartItem){
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

    deleteItem(event, item: CartItem){
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

    getDiscount(){
        return (this.cart) ? this.cart.totalDiscountPrice: 0.0;
    }

    getShipping(){
        return (this.cart) ? this.cart.totalFreightPrice : 0.0;
    }

    getSubTotal(){
        return (this.cart) ? this.cart.totalProductsPrice: 0.0;
    }

    getTotal(){
        return (this.cart) ? this.cart.totalPurchasePrice : 0.0;
    }

    getNumItemsInCart(){
        return (this.cart) ? this.cart.products.length : 0;

    }

    isMobile(): boolean{
        return AppSettings.isMobile();
    }
}