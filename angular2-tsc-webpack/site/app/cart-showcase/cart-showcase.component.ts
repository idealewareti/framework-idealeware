import { Component, OnInit } from '@angular/core';
import {CartService} from '../_services/cart.service';
import {ProductService} from '../_services/product.service';
import {CartShowCase} from '../_models/cartShowcase/cartShowcase';
import {Product} from '../_models/product/product';

@Component({
    moduleId: module.id,
    selector: 'cart-showcase',
    templateUrl: '/views/cart-showcase.component.html',
})
export class CartShowCaseComponent implements OnInit {
    cartShowCase: CartShowCase;
    products: Product[] = [];

    constructor(
        private service: CartService,
        private productService: ProductService

    ) { }

    ngOnInit() {
        this.getShowCases();
     }

    getShowCases(){
        this.service.getCartShowCase()
        .then(response => {
            this.cartShowCase = response;
            this.getProducts();
        })
        .catch(error => console.log(error));
    }

    getProducts(){
        if(this.cartShowCase.products.length > 0){
            let references =  this.cartShowCase.products;
            this.productService.getProducts(references)
                .then(response => this.products = response)
                .catch(error => console.log(error));
        }
    }
}