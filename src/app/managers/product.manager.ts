import { Injectable } from "@angular/core";
import { Sku } from "../models/product/sku";
import { Product } from "../models/product/product";
import { ProductPicture } from "../models/product/product-picture";
import { Category } from "../models/category/category";
import { Brand } from "../models/brand/brand";
import { TechnicalInformation } from "../models/product/product-technical-information";

@Injectable()
export class ProductManager {

    getSku(id: string, product: Product): Sku {
        return product.skus.filter(sku => sku.id == id)[0];
    }

    getSkuImages(skuId, product: Product): ProductPicture[] {
        return product.skus.filter(sku => sku.id == skuId)[0].pictures;
    }

    getSkuCoverImage(skuId, product: Product): ProductPicture {
        let image = Object.assign(new ProductPicture, this.getSkuImages(skuId, product).filter(p => p['position'] == 0)[0]);
        return image;
    }

    hasCoverImage(skuId, product: Product): boolean {
        if (product.skus.filter(sku => sku.id == skuId)[0].pictures) return true;
        else return false;
    }

    createProduct(object) {
        let product = new Product();

        for (var k in object) {
            if (k == 'baseCategory') {
                product.baseCategory = new Category(object.baseCategory);
            }
            else if (k == 'skus') {
                product.skus = object.skus.map(sku => new Sku(sku));
            }
            else if (k == 'skuBase') {
                product.skuBase = new Sku(object.skuBase);
            }
            else if (k == 'brand') {
                product.brand = new Brand(object.brand);
            }
            else if (k == 'pictures') {
                product.pictures = object.pictures.map(p => p = new ProductPicture(p));
            }
            else if (k == 'categories') {
                product.categories = object.categories.map(c => c = new Category(c));
            }
            else if (k == 'technicalInformation') {
                product.technicalInformation = object.technicalInformation.map(c => c = new TechnicalInformation(c));
            }
            else {
                product[k] = object[k];
            }
        }
        return product;
    }

    getCoverImage(product: Product) {
        let image: string;
        if (product.skuBase.picture['showcase']) {
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
}