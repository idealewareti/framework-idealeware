import { Component, OnInit } from '@angular/core';
import { Product } from "app/models/product/product";
import { ProductService } from "app/services/product.service";
import { ActivatedRoute } from "@angular/router";
declare var swal:any;

@Component({
    moduleId: module.id,
    selector: 'compare',
    templateUrl: '../../views/compare.component.html',
    styleUrls: ['../../styles/compare.component.css']
})
export class CompareComponent implements OnInit {
    products: Product[] = [];
    
    constructor(private service:ProductService, private route:ActivatedRoute) { }

    ngOnInit() {
        this.route.params
        .map(params => params)
        .subscribe(params => {
            window.scrollTo(0, 0); // por causa das hash url
            // let productsId = JSON.parse(localStorage.getItem('compare')); 
            let productsId = params['compare'].toString().split(',').map(p => p = {'id': p});

            this.service.getProducts(productsId)
            .then(products => {
                this.products = products;
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
}