import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { SearchManager } from "../managers/search.manager";
import { Search } from "../models/search/search";
import { PriceRange } from "../models/search/price-range";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class SearchResolver implements Resolve<Observable<any>> {

    constructor(private manager: SearchManager) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        let id = route.params.id;
        if (id)
            id = id.substr(id.length - 36);

        let page = route.params.page;
        if (page)
            page = (Number.parseInt(page) < 1) ? 1 : Number.parseInt(page);
        else page = 1;

        let module = this.getModule(route);
        let searchInput = this.prepareSearch(route.params, id, module);
        return this.manager.searchFor(searchInput, page, 9)
            .pipe(map(res => {
                return {
                    id: id,
                    searchResult: res,
                    searchInput: searchInput,
                    module: module,
                    page: page
                };
            }));
    }

    private prepareSearch(params, id, module): Search {
        let searchInput = new Search();
        searchInput.categories = [];
        searchInput.brands = [];
        searchInput.variations = [];
        searchInput.options = [];
        searchInput.groups = [];
        searchInput.priceRange = new PriceRange();

        /* Set Query */
        if (params['q']) {
            searchInput.name = params['q'].toString();
        }
        else {
            searchInput.name = null;
        }

        /* Set Brands */
        if (params['brands']) {
            searchInput.brands = params['brands'].toString().split(',');
        }

        /* Set Categories */
        if (params['categories']) {
            searchInput.categories = params['categories'].toString().split(',');
        }

        /* Set Variations */
        if (params['variations']) {
            searchInput.variations = params['variations'].toString().split(',');
        }

        /* Set Options */
        if (params['options']) {
            searchInput.options = params['options'].toString().split(',');
        }

        /* Set Groups */
        if (params['groups']) {
            searchInput.groups = params['groups'].toString().split(',');
        }

        if (module == 'category') {
            searchInput.categories.push(id);
        }

        if (module == 'brand') {
            searchInput.brands.push(id);
        }

        /*Busca grupos*/
        if (module == 'group') {
            searchInput.groups.push(id);
        }

        if (params['sort']) {
            searchInput.sort = Number.parseInt(params['sort']);
        }

        if (params['maximumPrice']) {
            searchInput.priceRange.maximumPrice = Number.parseFloat(Number.parseFloat(params['maximumPrice']).toFixed(2).replace('.', ','));
        }

        if (params['minimumPrice']) {
            searchInput.priceRange.minimumPrice = Number.parseFloat(Number.parseFloat(params['minimumPrice']).toFixed(2).replace('.', ','));
        }

        return searchInput;
    }

    getModule(route: ActivatedRouteSnapshot): string {
        return route.parent.url[0].path
            .replace('buscar', 'filter')
            .replace('categoria', 'category')
            .replace('marcas', 'brand')
            .replace('grupo', 'group');
    }
}