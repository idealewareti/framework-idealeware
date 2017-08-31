import { Component, OnInit, Input } from '@angular/core';
import { Product } from "app/models/product/product";
import { ProductService } from "app/services/product.service";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { AppSettings } from "app/app.settings";
import { Globals } from "app/models/globals";
declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'compare',
    templateUrl: '../../views/compare.component.html',
    styleUrls: ['../../styles/compare.component.css']
})
export class CompareComponent implements OnInit {
    products: Product[] = [];

    constructor(
        private service: ProductService,
        private route: ActivatedRoute,
        private titleService: Title,
        private globals: Globals
    ) { }

    ngOnInit() {
        window.scrollTo(0, 0); // por causa das hash url
         
        this.route.params
        .map(params => params)
        .subscribe(params => {
            let productsId = params['compare'].toString().split(',').map(p => p = { 'id': p });

            this.service.getProducts(productsId)
                .then(products => {
                    this.products = products;

                    let title: string = 'Comparando Produtos:';
                    this.products.forEach(product => {
                        title += ` ${product.name}`;
                    });

                    AppSettings.setTitle(title, this.titleService);
                })
                .catch(error => {
                    swal({
                        title: 'Erro ao comparar',
                        text: 'Não foi possível comparar os produtos.',
                        type: 'error',
                        confirmButtonText: 'OK'
                    });
                })
        });
    }

    getProductUrl(product:Product): string {
        return `/produto/${product.skuBase.id}/${product.niceName}`;
    }

    getCoverImage(product: Product): string{
        return `${this.globals.store.link}/${product.getCoverImage()}`;
    }
}