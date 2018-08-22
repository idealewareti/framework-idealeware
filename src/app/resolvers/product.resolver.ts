import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Product } from "../models/product/product";
import { ProductManager } from "../managers/product.manager";

@Injectable({
    providedIn: 'root'
})
export class ProductResolver implements Resolve<Observable<Product>> {

    constructor(private manager: ProductManager) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Product> {
        let id = route.params.produto_id;
        if (id)
            id = id.substr(id.length - 36);

        return this.manager.getProductBySku(id);
    }
}