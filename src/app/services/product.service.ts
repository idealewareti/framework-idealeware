import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { Product } from "../models/product/product";
import { environment } from "../../environments/environment";
import { Http } from "@angular/http";

@Injectable()
export class ProductService{
    client: HttpClientHelper;
    
    constructor(http: Http) {
        this.client = new HttpClientHelper(http);
    }

    getProductBySku(skuId: string) : Promise<Product>{
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PRODUCT}/products/sku/${skuId}`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response =>{
                let product = new Product(response);
                resolve(product)
                
            }, error => {
                reject(error);
            });
        });
    }

    getProductById(id: string) : Promise<Product>{
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PRODUCT}/products/${id}`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response =>{
                let product = new Product(response);
                resolve(product)
                
            }, error => {
                reject(error);
            });
        });
    }

    getProducts(references: Object[]) : Promise<Product[]>{
        return new Promise((resolve, reject) => {
            let products = [];
            if(references.length == 0) resolve(products);
            else{
                let url = `${environment.API_PRODUCT}/products/completebyreference`;
                this.client.post(url, references)
                .map(res => res.json())
                .subscribe(response => {
                    let products = response.map(p => p = new Product(p));
                    products.map(p => p.productUrl = `#/produto/${p.skuBase.id}/${p.niceName}`);
                    
                    resolve(products);
                }, error => {
                    reject(error);
                });
            }
        });
    }

    getProductsFromShowcaseGroup(groupId: string): Promise<Product[]>{
        return new Promise((resolve, reject) => {
            let url = `${environment.API_PRODUCT}/products/showcasegroups/${groupId}`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let products = response.map(p => p = new Product(p));
                resolve(products);
            }, error => reject(error));
        });
    }
}