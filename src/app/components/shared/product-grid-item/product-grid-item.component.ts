import { Component, PLATFORM_ID, Inject, Input, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../../../models/product/product';
import { Store } from '../../../models/store/store';
import { Sku } from '../../../models/product/sku';
import { AppCore } from '../../../app.core';
import { EnumStoreModality } from '../../../enums/store-modality.enum';

@Component({
    selector: 'product-grid-item',
    templateUrl: '../../../templates/shared/product-grid-item/product-grid-item.html',
    styleUrls: ['../../../templates/shared/product-grid-item/product-grid-item.scss']
})
export class ProductGridItemComponent implements OnInit {
    @Input() product: Product;
    @Input() store: Store;
    @Input() showCompare: boolean = false;

    sku: Sku = new Sku();
    coverImg: string;
    alternativeImg: string;
    mediaPath: string;
    parcelValue: number;
    price: number = 0;
    promotionalPrice: number = 0;
    private alternative: boolean = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        this.sku = this.product.skuBase;
        this.price = this.sku.price;
        this.promotionalPrice = this.sku.promotionalPrice;
    }

    getRoute(): string {
        return `/${AppCore.getNiceName(this.product.name)}-${this.sku.id}`;
    }

    setCoverImage(alternative: boolean) {
        this.alternative = alternative;
    }

    getCoverImage(): string {
        const mediaPath = `${this.store.link}/static/products`;
        let coverImg: string;
        if (this.alternative) {
            if (this.sku.alternativePicture) {
                coverImg = (this.sku.alternativePicture['showcase']) ? `${mediaPath}/${this.sku.alternativePicture.showcase}` : '/assets/images/no-image.jpg';
            }
            else if (this.sku.picture) {
                coverImg = (this.sku.picture['showcase']) ? `${mediaPath}/${this.sku.picture.showcase}` : '/assets/images/no-image.jpg';
            }
            else {
                coverImg = '/assets/images/no-image.jpg';
            }
        }
        else {
            if (this.sku.picture) {
                coverImg = (this.sku.picture['showcase']) ? `${mediaPath}/${this.sku.picture.showcase}` : '/assets/images/no-image.jpg';
            }
            else {
                coverImg = '/assets/images/no-image.jpg';
            }
        }
        return coverImg;
    }

    getModality(): number {
        if (this.store) {
            return this.store.modality;
        }
        return -1;
    }

    isBudget(): boolean {
        if (this.store && this.store.modality == EnumStoreModality.Budget) {
            return true;
        }
        return false;
    }

    isAvailable(): boolean {
        if (this.store.modality == EnumStoreModality.Budget && this.sku.available) {
            return true;
        }
        else if (this.store.modality == EnumStoreModality.Ecommerce && this.sku.available && this.sku.stock > 0) {
            return true;
        }
        else return false;
    }

    isComparing(id: string): boolean {
        if (isPlatformBrowser(this.platformId)) {
            let compare: any[] = JSON.parse(localStorage.getItem('compare'));
            if (!compare)
                return false;
            else if (compare.filter(p => p.id == id).length > 0)
                return true;
            else
                return false;
        }
        else return false;
    }

    addToCompare(event, product) {
        event.preventDefault();
        if (isPlatformBrowser(this.platformId)) {
            let compare = JSON.parse(localStorage.getItem('compare'));
            if (!compare)
                compare = [];
            if (!this.isComparing(product.id) && compare.length < 3) {
                compare.push({ id: product.id });
                localStorage.setItem('compare', JSON.stringify(compare));
            }
            else if (this.isComparing(product.id)) {
                let index = compare.findIndex(p => p.id == product.id);
                if (index > -1) {
                    compare.splice(index, 1);
                    localStorage.setItem('compare', JSON.stringify(compare));
                }
            }
        }
    }
}