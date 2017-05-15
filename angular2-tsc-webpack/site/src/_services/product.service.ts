import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HttpClient} from '../httpclient'
import {AppSettings} from '../app.settings';
import {Product} from '../_models/product/product';
import {Sku} from '../_models/product/sku';
import {ProductPicture} from '../_models/product/product-picture';
import { NgProgressService } from "ngx-progressbar";
import { ProductAwaited } from "../_models/productAwaited/product-awaited";
import { ProductRating } from "../_models/productRating/product-rating";
import { ProductRatingCreate } from "../_models/productRating/product-rating-create";

@Injectable()
export class ProductService{
    
    constructor(
        private client: HttpClient,
        private loaderService: NgProgressService
    ){ }

    getProductBySku(skuId: string) : Promise<Product>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PRODUCT}/products/sku/${skuId}`;
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
            let url = `${AppSettings.API_PRODUCT}/products/${id}`;
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
                let url = `${AppSettings.API_PRODUCT}/products/completebyreference`;
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
            let url = `${AppSettings.API_PRODUCT}/products/showcasegroups/${groupId}`;
            this.client.get(url)
            .map(res => res.json())
            .subscribe(response => {
                let products = response.map(p => p = new Product(p));
                resolve(products);
            }, error => reject(error));
        });
    }

    createProductAwaited(productAwaited:ProductAwaited):Promise<ProductAwaited>{
        return new Promise((resolve, reject) => 
        {
            let url = `${AppSettings.API_PRODUCTAWAITED}/productsAwaited`;
            this.client.post(url, productAwaited)
            .map(res => res.json())
            .subscribe(response => {
                let productsAwaited = new ProductAwaited(response);
                resolve(productsAwaited);
            }, error => reject(error));
        });
    }

     getProductRating(id:string) : Promise<ProductRating>{
        return new Promise((resolve, reject) => {
            let url = `${AppSettings.API_PRODUCTRATING}/productrating/Approved/${id}`;
            this.client.get(url)
                .map(res => res.json())
                .subscribe(response =>{
                    let productRating = new ProductRating(response);
                    resolve(productRating)
                }, error => {
                    reject(error);
                });
        });
    }

    createProductRating(productRating:ProductRatingCreate):Promise<ProductRatingCreate>{
      return new Promise((resolve, reject) => 
        {
            let url = `${AppSettings.API_PRODUCTRATING}/productrating`;
            this.client.post(url, productRating)
            .map(res => res.json())
            .subscribe(response => {
                let productsRating = new ProductRatingCreate(response);
                resolve(productsRating);
            }, error => reject(error));
        });
    }
}