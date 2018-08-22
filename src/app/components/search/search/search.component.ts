import { Component, OnInit, PLATFORM_ID, Inject, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Category } from "../../../models/category/category";
import { Brand } from "../../../models/brand/brand";
import { Product } from "../../../models/product/product";
import { Search } from "../../../models/search/search";
import { Filter } from "../../../models/search/search-filter";
import { Variation } from "../../../models/product/variation";
import { Group } from "../../../models/group/group";
import { VariationOption } from "../../../models/product/product-variation-option";
import { Store } from "../../../models/store/store";
import { Pagination } from "../../../models/pagination";
import { SearchResult } from "../../../models/search/search-result";
import { EnumSort } from "../../../enums/sort.enum";
import { PriceRange } from "../../../models/search/price-range";
import { EnumStoreModality } from "../../../enums/store-modality.enum";
import { AppCore } from '../../../app.core';
import { isPlatformBrowser } from '@angular/common';
import { SeoManager } from '../../../managers/seo.manager';

declare var $: any;

@Component({
    selector: 'search',
    templateUrl: '../../../templates/search/search/search.html',
    styleUrls: ['../../../templates/search/search/search.scss']
})
export class SearchComponent implements OnInit {
    private loading: boolean = true;
    private store: Store;

    id: string;
    module: string;
    filterModel: Filter = new Filter();
    searchInput: Search = new Search();
    pagination: Pagination;
    products: Product[] = [];
    categories: Category[] = [];
    brands: Brand[] = [];
    variations: Variation[] = [];
    options: VariationOption[] = []
    groups: Group[] = [];
    page: number = 1;
    numPages: number = 0;
    sort: EnumSort = EnumSort.MostRelevant;
    maximumPrice: string = null;
    minimumPrice: string = null;


    orderSearchOptionsEcommerce: Object[] = [
        { label: 'Mais Relevantes', value: EnumSort.MostRelevant },
        { label: 'Menores Preços', value: EnumSort.PriceLowestFirst },
        { label: 'Maiores Preços', value: EnumSort.PriceHighestFirst },
        { label: 'Ordem Alfabética Crescente', value: EnumSort.NameAtoZ },
        { label: 'Ordem Alfabética Decrescente', value: EnumSort.NameZtoA },
    ];
    orderSearchOptionsCatalog: Object[] = [
        { label: 'Mais Relevantes', value: EnumSort.MostRelevant },
        { label: 'Ordem Alfabética Crescente', value: EnumSort.NameAtoZ },
        { label: 'Ordem Alfabética Decrescente', value: EnumSort.NameZtoA },
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private seoManager: SeoManager,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        this.route.params
            .subscribe(() => {
                this.store = this.route.snapshot.data.store;
                this.id = this.route.snapshot.data.search.id;
                this.module = this.route.snapshot.data.search.module;
                this.searchInput = this.route.snapshot.data.search.searchInput;
                this.sort = this.searchInput.sort || EnumSort.MostRelevant;
                this.page = this.route.snapshot.data.search.page;

                this.applyResults(this.route.snapshot.data.search.searchResult);
            });
    }

    /* Paginations */
    listProducts(page: number, event = null) {
        if (event)
            event.preventDefault();
        this.searchInput.sort = this.sort;
        this.setFilter();
    }

    /* Filters */
    public addFilter(event, collection, item) {
        event.preventDefault();

        if (collection == 'category') {
            if (this.searchInput.categories.findIndex(c => c == item) < 0)
                this.searchInput.categories.push(item);
            else
                this.searchInput.categories.splice(this.searchInput.categories.findIndex(c => c == item), 1);
        }
        if (collection == 'brand') {
            if (this.searchInput.brands.findIndex(b => b == item) < 0)
                this.searchInput.brands.push(item);
            else {
                this.searchInput.brands.splice(this.searchInput.brands.findIndex(b => b == item), 1);
            }
        }

        if (collection == 'variation') {
            if (this.searchInput.variations.findIndex(v => v == item) < 0)
                this.searchInput.variations.push(item);
            else {
                this.searchInput.variations.splice(this.searchInput.variations.findIndex(b => b == item), 1);
            }
        }

        if (collection == 'option') {
            if (this.searchInput.options.findIndex(o => o == item) < 0)
                this.searchInput.options.push(item);
            else {
                this.searchInput.options.splice(this.searchInput.options.findIndex(b => b == item), 1);
            }
        }

        if (collection == 'group') {
            if (this.searchInput.groups.findIndex(g => g == item) < 0)
                this.searchInput.groups.push(item);
            else {
                this.searchInput.groups.splice(this.searchInput.groups.findIndex(b => b == item), 1);
            }
        }
        this.setFilter();
    }

    public clearFilter(event) {
        event.preventDefault();
        this.searchInput = new Search();
        this.setFilter();
    }

    createFilterUrl(searchInput: Search = null, maximumPrice: number, minimumPrice: number, sort: EnumSort = null): string {
        let url: string = '';

        url = '/buscar';
        if (searchInput && searchInput.name && this.products.length > 0) {
            url += `;q=${encodeURIComponent(searchInput.name)}`;
        }
        if (searchInput.categories.length > 0) {
            url += `;categories=${searchInput.categories.toString()}`;
        }
        if (searchInput.brands.length > 0) {
            url += `;brands=${searchInput.brands.toString()}`;
        }
        if (searchInput.variations.length > 0) {
            url += `;variations=${searchInput.variations.toString()}`;
        }
        if (searchInput.options.length > 0) {
            url += `;options=${searchInput.options.toString()}`;
        }
        if (searchInput.groups.length > 0) {
            url += `;groups=${searchInput.groups.toString()}`;
        }
        if (searchInput.priceRange.maximumPrice > 0) {
            url += `;maximumPrice=${maximumPrice.toFixed(2)}`;
        }
        if (searchInput.priceRange.minimumPrice > 0) {
            url += `;minimumPrice=${minimumPrice}`;
        }

        if (sort) {
            url += `;sort=${sort}`
        }
        return url;
    }

    setFilter() {
        let url = this.createFilterUrl(this.searchInput,
            Number.parseFloat(this.maximumPrice),
            Number.parseFloat(this.minimumPrice), this.sort || null);
        this.router.navigateByUrl(url);
    }

    /* Validadores*/
    hasFilters(): boolean {
        if (this.filterModel.categories.length > 0
            || this.filterModel.brands.length > 0
            || this.filterModel.variations.length > 0
            || this.filterModel.options.length > 0
            || this.filterModel.groups.length > 0
        ) {
            return true;
        }
        else return false;
    }

    isChecked(collection, id): boolean {
        if (collection == 'brand') {
            if (this.searchInput.brands.findIndex(brand => brand == id) > -1) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (collection == 'category') {
            if (this.searchInput.categories.findIndex(category => category == id) > -1) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (collection == 'variation') {
            if (this.searchInput.variations.findIndex(variation => variation == id) > -1) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (collection == 'option') {
            if (this.searchInput.options.findIndex(option => option == id) > -1) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    isLoading(): boolean {
        return this.loading;
    }

    getBreadCrump(): Category[] {
        if (this.module == 'category' && this.categories && this.categories.length > 0) {
            return [this.categories[0]];
        }
        else
            return null;
    }

    buildFilterModel() {
        this.filterModel = new Filter();

        this.searchInput.categories.forEach(id => {
            let category = this.categories.filter(x => x.id == id)[0];
            if (category) this.filterModel.categories.push(category);
        });

        this.searchInput.brands.forEach(id => {
            let brand = this.brands.filter(x => x.id == id)[0];
            if (brand) this.filterModel.brands.push(brand);
        });

        this.searchInput.variations.forEach(id => {
            let variation = this.variations.filter(x => x.id == id)[0];
            if (variation) this.filterModel.variations.push(variation);
        });

        this.searchInput.options.forEach(id => {
            let option = this.options.filter(x => x.id == id)[0];
            if (option) this.filterModel.options.push(option);
        });

        this.searchInput.groups.forEach(id => {
            let group = this.groups.filter(x => x.id == id)[0];
            if (group) this.filterModel.groups.push(group);
        });
    }

    filterIsEmpty() {
        if (
            this.filterModel.brands.length == 0
            && this.filterModel.categories.length == 0
            && this.filterModel.options.length == 0
            && this.filterModel.variations.length == 0
            && this.filterModel.groups.length == 0
            && !this.filterModel.query
        )
            return true;
        else return false;
    }

    /* Compare */
    isCompare(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            let compare = JSON.parse(localStorage.getItem('compare'));
            return compare && compare.length > 1
        }
        else
            return false;
    }

    getCompare() {
        if (isPlatformBrowser(this.platformId)) {
            let compare = JSON.parse(localStorage.getItem('compare'));
            return compare;
        }
        else
            return [];
    }

    queryCompare(): string {
        if (isPlatformBrowser(this.platformId)) {
            let compare = JSON.parse(localStorage.getItem('compare'));
            let query: string = '';
            let i = 0;
            compare.forEach(item => {
                query += `${item.id}${(i < compare.length - 1) ? ',' : ''}`;
                i++;
            });

            return query;
        }
        return null;
    }

    closeCompare() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('compare');
        }
    }

    /* Events */
    changeOrdernation(event) {
        this.listProducts(this.page);
    }

    resultsFound(): string {
        if (this.pagination.TotalCount == 1) {
            return `${this.pagination.TotalCount} produto`;
        }
        else if (this.pagination.TotalCount > 1) {
            return `${this.pagination.TotalCount} produtos`;
        }
        else {
            return `Nenhum produto`;
        }
    }

    totalItens(): number {
        if (this.pagination) {
            return this.pagination.TotalCount;
        }
        else {
            return 0;
        }
    }

    hasItens(): boolean {
        return this.totalItens() != 0;
    }

    navigate(page: number, event = null) {
        if (event) {
            event.preventDefault();
        }
        let url = this.createFilterUrl(this.searchInput, Number.parseFloat(this.maximumPrice), Number.parseFloat(this.minimumPrice), (this.sort) ? this.sort : null);
        url = `${url};page=${page}`;
        this.router.navigateByUrl(url);
    }

    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;
    }

    filterBox() {
        if (isPlatformBrowser(this.platformId)) {

            $('.showcase-department, #filterby-title').hide();
            $('#filter').fadeIn();

            $(".btn-clear-all").click(function(){
                $('#filter .btn-close').click();
                return false;     
            });

            $('#filter .lvl1-link').click(function () {
                var $lvl2 = $(this).parents('li').find('.lvl2');
                $lvl2.fadeIn();
                return false;
            });
            $('#filter .btn-back').click(function () {
                var $lvl2 = $(this).parents('.lvl2');
                $lvl2.fadeOut();
                return false;
            });
            $('#filter .btn-close, #filter label').click(function () {
                $('#filter .lvl2').fadeOut();
                $('#filter').fadeOut();
                $('.showcase-department, #filterby-title').show();
                return false;
            });
        }
    }

    showFilter(collection: any[]): boolean {
        return collection && collection.length > 0;
    }

    applyResults(results: SearchResult) {
        this.loading = false;
        if (results.facetCategories) {
            this.categories = results.facetCategories;
        }

        if (results.facetBrands) {
            this.brands = results.facetBrands;
        }

        if (results.facetOptions) {
            this.options = results.facetOptions;
        }

        if (results.facetVariations) {
            this.variations = results.facetVariations;
        }

        if (results.products) {
            this.products = results.products;
        } else {
            this.products = [];
        }

        if (results.facetPrice) {
            this.maximumPrice = results.facetPrice.maximumPrice.toFixed(2).replace('.', ',');
            this.minimumPrice = results.facetPrice.minimumPrice.toFixed(2).replace('.', ',');
        } else {
            this.maximumPrice = '0,00';
            this.minimumPrice = '0,00';
        }

        this.pagination = results.pagination;
        this.numPages = this.pagination.TotalPages;

        this.seoManager.setTags({
            title: results.metaTagTitle,
            description: results.metaTagDescription
        });

        this.buildFilterModel();
    }

    getStore(): Store {
        return this.store;
    }

    isCatalog(): boolean {
        if (this.store.modality == EnumStoreModality.Budget)
            return true;
        else return false;
    }

    isHiddenVariation(): boolean {
        let type = this.store.settings.find(s => s.type == 4);
        if (type)
            return type.status;
        else
            return false;
    }

    showValues(): boolean {
        if (!this.isCatalog())
            return true;
        else if (this.isCatalog() && this.store.settings.find(s => s.type == 3 && s.status == true))
            return true;
        else return false;
    }

    filterByPriceRange(event) {
        if (event)
            event.preventDefault();
        this.searchInput.priceRange = {
            minimumPrice: Number.parseFloat(this.minimumPrice),
            maximumPrice: Number.parseFloat(this.maximumPrice)
        }
        this.listProducts(this.page);
    }

    removeFilterByPriceRange(event) {
        if (event) {
            event.preventDefault();
        }
        this.searchInput.priceRange = new PriceRange();
        this.listProducts(this.page);

    }

    removeFilterQuery(event) {
        if (event) {
            event.preventDefault();
        }
        this.searchInput.name = null;
        this.setFilter();
    }

    hasReload(searchInput: Search): boolean {
        if (searchInput.name) {
            return true;
        }
        if (searchInput.brands.length > 0) {
            return true;
        }
        if (searchInput.categories.length > 0) {
            return true;
        }
        if (searchInput.options.length > 0) {
            return true;
        }
        if (searchInput.variations.length > 0) {
            return true;
        }
        if (searchInput.sort) {
            return true;
        }
        if (searchInput.priceRange && searchInput.priceRange.maximumPrice) {
            return true;
        }
        if (searchInput.priceRange && searchInput.priceRange.minimumPrice) {
            return true;
        }
        else {
            return false;
        }
    }

    getRoute(): string {
        return this.createFilterUrl(this.searchInput, Number.parseFloat(this.maximumPrice), Number.parseFloat(this.minimumPrice), (this.sort) ? this.sort : null);
    }

    trackById(index, item) {
        return item.id;
    }
}