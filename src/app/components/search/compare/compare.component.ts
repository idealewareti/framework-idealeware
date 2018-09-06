import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Product } from '../../../models/product/product';
import { ProductService } from '../../../services/product.service';
import { Store } from '../../../models/store/store';
import { ModelReference } from '../../../models/model-reference';
import { AppCore } from '../../../app.core';
import { isPlatformBrowser } from '@angular/common';
import { ProductManager } from '../../../managers/product.manager';
import { StoreManager } from '../../../managers/store.manager';
declare var swal: any;

@Component({
    selector: 'compare',
    templateUrl: '../../../templates/search/compare/compare.html',
    styleUrls: ['../../../templates/search/compare/compare.scss']
})
export class CompareComponent implements OnInit {
    products: Product[] = [];
    store: Store;

    constructor(
        private storeManager: StoreManager,
        private productManager: ProductManager,
        private route: ActivatedRoute,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.route.params
                .subscribe(params => {
                    this.storeManager.getStore()
                        .subscribe(store => {
                            this.store = store;
                            let productsId: ModelReference[] = params['compare'].toString().split(',').map(p => p = { 'id': p });
                            let title: string = 'Comparando Produtos:';
                            if (productsId.length > 0) {
                                productsId.forEach(p => {
                                    this.productManager.getProductBySku(p.id)
                                        .subscribe(product => {
                                            this.products.push(product);
                                            title += ` ${product.name}`;
                                        }, error => {
                                            if (isPlatformBrowser(this.platformId)) {
                                                swal('Erro ao comparar', 'Não foi possível comparar os produtos.', 'error');
                                            }
                                        });
                                });
                            }
                        });
                });
        }
    }

    getStore(): Store {
        if (isPlatformBrowser(this.platformId)) {
            return this.store;
        }
    }

    getProductUrl(product: Product): string {
        if (isPlatformBrowser(this.platformId)) {
            return `/${AppCore.getNiceName(product.name)}-${product.skuBase.id}`;
        }
    }

    getCoverImage(product: Product): string {
        if (isPlatformBrowser(this.platformId)) {
            return `${this.store.link}${this.productManager.getCoverImage(product)}`;
        }
    }
}