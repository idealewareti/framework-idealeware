import { Injectable } from "@angular/core";
import { NgProgressService } from "ngx-progressbar";
import { HttpClient } from "app/helpers/httpclient";
import { EnVariationType } from "app/enums/variationtype.enum";
import { AppSettings } from "app/app.settings";
import { RelatedProductGroup } from "app/models/related-products/related-product-group";

@Injectable()
export class RelatedProductsService{

    constructor(private client: HttpClient, private loaderService: NgProgressService){}

    getRelatedProducts(
        name: string = null,
        nameProduct: string = null,
        codeProduct: string = null, 
        variation: EnVariationType = null, 
        page: number = null, 
        pageSize: number = null
    ): Promise<RelatedProductGroup[]>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_RELATEDPRODUCTS}/group?name=${name}&nameProduct=${nameProduct}&codeProduct=${codeProduct}&variation=${variation}&page=${page}&pageSize=${pageSize}`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let groups = response.map(p => p = new RelatedProductGroup(p));
                resolve(groups);
            }, error => reject(error));
        });
    }

    getRelatedProductGroupById(id: string): Promise<RelatedProductGroup>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_RELATEDPRODUCTS}/RelatedProducts/group/${id}`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let group = new RelatedProductGroup(response);
                resolve(group);
            }, error => reject(error));
        });
    }

}