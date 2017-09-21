import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RelatedProductGroup } from "app/models/related-products/related-product-group";
import { EnVariationType } from "app/enums/variationtype.enum";
import { ProductReference } from "app/models/related-products/product-reference";
import { ProductService } from "app/services/product.service";
import { Product } from "app/models/product/product";

@Component({
    moduleId: module.id,
    selector: 'related-products',
    templateUrl: '../../views/related-products.component.html'
})
export class RelatedProductsComponent implements OnInit {
    
    @Input() relatedProducts: RelatedProductGroup;
    @Output() productUpdated: EventEmitter<Product> = new EventEmitter<Product>();
    @Input() product: Product = new Product();
    
    constructor(private service: ProductService) { }

    ngOnInit() { }

    isColor(): boolean{
        if(this.relatedProducts.type == EnVariationType.Color)
            return true;
        else return false;
    }

    selectProduct(reference: ProductReference, event = null){
        if(event)
            event.preventDefault();
        
        this.service.getProductBySku(reference.skuId)
        .then(product => {
            this.product = product;
            this.productUpdated.emit(this.product);
        });
    }

    isProductSelected(reference: ProductReference): boolean{
        if(this.product.skuBase.id == reference.skuId)
            return true;
        else return false;
    }

}