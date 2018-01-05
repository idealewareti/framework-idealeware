import { Component, OnInit, Input, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { RelatedProductGroup } from "../../../models/related-products/related-product-group";
import { EnVariationType } from "../../../enums/variationtype.enum";
import { ProductReference } from "../../../models/related-products/product-reference";
import { ProductService } from "../../../services/product.service";
import { Product } from "../../../models/product/product";

@Component({
    moduleId: module.id,
    selector: 'app-related-products',
    templateUrl: '../../../template/product/product-related/related-products.html',
    styleUrls: ['../../../template/product/product-related/related-products.scss']
})
export class RelatedProductsComponent implements OnInit {

    @Input() relatedProducts: RelatedProductGroup;
    @Output() productUpdated: EventEmitter<Product> = new EventEmitter<Product>();
    @Input() product: Product = new Product();

    constructor(
        private service: ProductService,
    ) { }

    ngOnInit() { }

    isColor(): boolean {
        if (this.relatedProducts.type == EnVariationType.Color)
            return true;
        else return false;
    }

    selectProduct(reference: ProductReference, event = null) {
        if (event)
            event.preventDefault();

        this.service.getProductBySku(reference.skuId)
            .subscribe(product => {
                this.product = product;
                this.productUpdated.emit(this.product);
            });
    }

    isProductSelected(reference: ProductReference): boolean {
        if (this.product.skuBase.id == reference.skuId)
            return true;
        else return false;
    }

}