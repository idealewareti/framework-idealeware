import { Injectable } from "@angular/core";
import { Sku } from "../models/product/sku";
import { Product } from "../models/product/product";
import { ProductPicture } from "../models/product/product-picture";
import { Observable } from "rxjs";
import { ProductService } from "../services/product.service";
import { IntelipostService } from "../services/intelipost.service";
import { ProductShippingModel } from "../models/product/product-shipping";
import { Intelipost } from "../models/intelipost/intelipost";
import { ProductAwaited } from "../models/product-awaited/product-awaited";
import { ProductAwaitedService } from "../services/product-awaited.service";
import { RelatedProductGroup } from "../models/related-products/related-product-group";
import { RelatedProductsService } from "../services/related-products.service";

@Injectable({
    providedIn: 'root'
})
export class ProductManager {

    constructor(
        private service: ProductService,
        private serviceIntelipost: IntelipostService,
        private serviceAwaited: ProductAwaitedService,
        private relatedService: RelatedProductsService,
    ) { }

    getProductBySku(skuId: string): Observable<Product> {
        return this.service.getProductBySku(skuId);
    }

    getProductById(id: string): Observable<Product> {
        return this.service.getProductById(id);
    }

    getProducts(references: Object[]): Observable<Product[]> {
        return this.service.getProducts(references);
    }

    getProductsFromShowcaseGroup(groupId: string): Observable<Product[]> {
        return this.service.getProductsFromShowcaseGroup(groupId);
    }

    getSku(id: string, product: Product): Sku {
        return product.skus.find(sku => sku.id == id);
    }

    getSkuImages(skuId, product: Product): ProductPicture[] {
        return product.skus.find(sku => sku.id == skuId).pictures;
    }

    hasCoverImage(skuId, product: Product): boolean {
        if (product.skus.find(sku => sku.id == skuId).pictures) return true;
        else return false;
    }

    getCoverImage(product: Product) {
        let image: string;
        if (product.skuBase.picture) {
            image = `/static/products/${product.skuBase.picture.showcase}`;
        }
        else {
            image = `/assets/images/no-image.jpg`;
        }
        return image;
    }

    CoverImage(product: Product): ProductPicture {
        if (product.skuBase.picture) {
            return product.skuBase.picture;
        }
        else return null;
    }

    getSkuCoverImage(skuId, product: Product): ProductPicture {
        let image = Object.assign(new ProductPicture, this.getSkuImages(skuId, product).filter(p => p['position'] == 0)[0]);
        return image;
    }

    getShippingProduct(product: ProductShippingModel): Observable<Intelipost> {
        return this.serviceIntelipost.getProductShipping(product);
    }

    createProductAwaited(productAwaited: ProductAwaited): Observable<ProductAwaited> {
        return this.serviceAwaited.createProductAwaited(productAwaited);
    }
    getRelatedProductGroupById(id: string): Observable<RelatedProductGroup> {
        return this.relatedService.getRelatedProductGroupById(id);
    }
}