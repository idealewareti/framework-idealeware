import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { Product } from '../../../models/product/product';
import { ProductService } from '../../../services/product.service';
import { Globals } from '../../../models/globals';
import { Store } from '../../../models/store/store';
import { ModelReference } from '../../../models/model-reference';
import { AppCore } from '../../../app.core';
import { isPlatformBrowser } from '@angular/common';
import { ProductManager } from '../../../managers/product.manager';
import { AppConfig } from '../../../app.config';
import { StoreManager } from '../../../managers/store.manager';
declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'app-compare',
    templateUrl: '../../../template/search/compare/compare.html',
    styleUrls: ['../../../template/search/compare/compare.scss']
})
export class CompareComponent implements OnInit {
    products: Product[] = [];
    store: Store;

    constructor(
        private service: ProductService,
        private storeManager: StoreManager,
        private productManager: ProductManager,
        private route: ActivatedRoute,
        private titleService: Title,
        private globals: Globals,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) { }

    ngOnInit() {
        this.route.params
            .map(params => params)
            .subscribe(params => {
                this.storeManager.getStore()
                    .then(store => {
                        this.store = store;
                        let productsId: ModelReference[] = params['compare'].toString().split(',').map(p => p = { 'id': p });
                        let title: string = 'Comparando Produtos:';
                        if (productsId.length > 0) {
                            productsId.forEach(p => {
                                this.service.getProductBySku(p.id)
                                    .subscribe(product => {
                                        this.products.push(product);
                                        title += ` ${product.name}`;
                                    }, error => {
                                        if (isPlatformBrowser(this.platformId)) {
                                            swal('Erro ao comparar', 'Não foi possível comparar os produtos.', 'error');
                                        }
                                    });
                            });
                            this.titleService.setTitle(title);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            });
    }

    getStore(): Store {
        return this.store;
    }

    getProductUrl(product: Product): string {
        return `/${AppCore.getNiceName(product.name)}-${product.skuBase.id}`;
    }

    getCoverImage(product: Product): string {
        return `${this.store.link}${this.productManager.getCoverImage(product)}`;
    }
}