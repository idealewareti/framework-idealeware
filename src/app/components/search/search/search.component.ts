import { Component, OnInit, OnDestroy, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Category } from "../../../models/category/category";
import { Brand } from "../../../models/brand/brand";
import { Product } from "../../../models/product/product";
import { CategoryService } from "../../../services/category.service";
import { Search } from "../../../models/search/search";
import { BrandService } from "../../../services/brand.service";
import { Title, Meta } from "@angular/platform-browser";
import { Filter } from "../../../models/search/search-filter";
import { Variation } from "../../../models/product/variation";
import { Group } from "../../../models/group/group";
import { VariationOption } from "../../../models/product/product-variation-option";
import { Store } from "../../../models/store/store";
import { Pagination } from "../../../models/pagination";
import { SearchResult } from "../../../models/search/search-result";
import { EnumSort } from "../../../enums/sort.enum";
import { GroupService } from "../../../services/group.service";
import { PriceRange } from "../../../models/search/price-range";
import { Globals } from "../../../models/globals";
import { EnumStoreModality } from "../../../enums/store-modality.enum";
import { SearchService } from '../../../services/search.service';
import { AppCore } from '../../../app.core';
import { isPlatformBrowser } from '@angular/common';
import { StoreService } from '../../../services/store.service';
import { error } from 'util';
import { AppConfig } from '../../../app.config';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'app-search',
    templateUrl: '../../../template/search/search/search.html',
    styleUrls: ['../../../template/search/search/search.scss']
})
export class SearchComponent implements OnInit {
    loading: boolean = true;
    showAll: boolean = false;
    categoriesArranged: boolean = false;
    path: string;
    id: string;
    niceName: string;
    module: string;
    filterModel: Filter;
    orderBy: string = null;
    sortBy: string[] = [];
    pageSize: number = 16;
    pages: number[];
    pagination: Pagination;
    products: Product[] = [];
    category: Category;
    categories: Category[] = [];
    brand: Brand;
    brands: Brand[] = [];
    variations: Variation[] = [];
    options: VariationOption[] = []
    group: Group;
    groups: Group[] = [];
    page: number = 1;
    numPages: number = 0;
    sort: EnumSort = EnumSort.MostRelevant;
    maximumPrice: string = null;
    minimumPrice: string = null;
    priceRange: PriceRange = new PriceRange(0, 0);
    store: Store;

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

    searchInput: Search;

    constructor(
        private route: ActivatedRoute,
        private parentRouter: Router,
        private categoryApi: CategoryService,
        private brandApi: BrandService,
        private groupApi: GroupService,
        private storeApi: StoreService,
        private service: SearchService,
        private titleService: Title,
        private metaService: Meta,
        private globals: Globals,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        this.route.params
            .map(params => params)
            .subscribe(params => {
                /* Unsetting filter */
                if (isPlatformBrowser(this.platformId)) {
                    window.scrollTo(0, 0);
                }
                this.id = params['id'];
                this.searchInput = new Search();
                this.filterModel = new Filter();
                this.category = new Category();
                this.categories = [];
                this.sort = EnumSort.MostRelevant;
                this.minimumPrice = null;
                this.maximumPrice = null;
                this.priceRange = new PriceRange(0, 0);

                this.titleService.setTitle('Buscar Produtos');

                this.fetchStore()
                    .then(store => {
                        this.store = store;
                        return this.getModule();
                    })
                    .then(module => {
                        this.module = module;
                        if (params['id'])
                            this.id = params['id'];

                        this.orderBy = (params['orderBy']) ? params['orderBy'] : undefined;
                        if (params['page'])
                            this.page = (Number.parseInt(params['page']) < 1) ? 1 : Number.parseInt(params['page']);
                        else this.page = 1;
                        this.products = [];
                        return this.prepareSearch(params);
                    })
                    .then(results => {
                        this.applyResults(results);
                    })
                    .catch(error => {
                        console.log(error);
                        this.loading = false;
                        this.variations = [];
                        this.options = [];
                        this.brands = [];
                        // this.getCategories()
                        //     .then(categories => this.buildFilterModel());
                    });
            });
    }

    ngAfterViewChecked() {
        if (this.isMobile())
            this.filterBox();
    }

    ngOnDestroy() {
        this.metaService.removeTag("name='title'");
        this.metaService.removeTag("name='description'");
    }

    /* Paginations */
    listProducts(page: number, event = null) {
        if (event)
            event.preventDefault();
        this.searchInput.sort = this.sort;
        // this.search(this.searchInput, page, this.pageSize)
        // .then(result => {
        //     this.applyResults(result);
        //     this.buildUrl();
        // });

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

    createFilterUrl(moduleName: string, id: string, name: string, reload: boolean = false, searchInput: Search = null, maximumPrice: number, minimumPrice: number, sort: EnumSort = null): string {
        let url: string = '';
        if (moduleName == 'category' && !reload) {
            url = `/categoria/${id}/${AppCore.getNiceName(name)}`;
        }
        else if (moduleName == 'brand' && !reload) {
            url = `/marcas/${id}/${AppCore.getNiceName(name)}`;
        }
        else if (moduleName == 'group' && !reload) {
            url = `/grupo/${id}/${AppCore.getNiceName(name)}`;
        }
        else {
            url = '/buscar';
            if (searchInput && searchInput.name) {
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
        }
        if (sort) {
            url += `;sort=${sort}`
        }
        return url;
    }

    buildUrl(reload: boolean = false): string {
        let id: string = '';
        let name: string = '';

        switch (this.module) {
            case 'category':
                id = this.id;
                name = this.category.name;
                break;
            case 'brand':
                id = this.id;
                name = this.brand.name;
                break;
            case 'group':
                id = this.id;
                name = this.group.name;
                break;
            default:
                break;
        }
        return this.createFilterUrl(this.module, id, name, reload, this.searchInput, Number.parseFloat(this.maximumPrice), Number.parseFloat(this.minimumPrice), (this.sort) ? this.sort : null);
    }

    setFilter() {
        let url = this.buildUrl(true);
        this.parentRouter.navigateByUrl(url);
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

    /* Fillers */
    getLowestCategory(): Category {
        if (this.category.children.length > 0) {
            this.category.children.forEach(lvl2 => {
                if (this.isChecked('category', lvl2.id))
                    return lvl2;
                else {
                    lvl2.children.forEach(lvl3 => {
                        if (this.isChecked('category', lvl3.id))
                            return lvl3;
                    });
                }
            })
        }
        else return this.category;
    }

    getBreadCrump(): Category {
        if (this.module == 'category' && this.category && this.category.id) {
            return this.category;
        }
        else
            return null;
    }

    getBrand() {
        this.brand = new Brand();
        if (this.module == 'brand') {
            this.brandApi.getBrand(this.id)
                .subscribe(brand => {
                    this.brand = brand;
                    this.titleService.setTitle(brand.metaTagTitle);
                    this.metaService.addTags([
                        { name: 'title', content: brand.metaTagTitle },
                        { name: 'description', content: brand.metaTagDescription }
                    ]);
                }, error => console.log(error));
        }
    }

    getGroup(id: string): Promise<Group> {
        return new Promise((resolve, reject) => {
            this.groupApi.getById(id)
                .subscribe(group => {
                    this.titleService.setTitle(group.metaTagTitle);
                    this.metaService.addTags([
                        { name: 'title', content: group.metaTagTitle },
                        { name: 'description', content: group.metaTagDescription }
                    ]);
                    this.group = group;
                    resolve(group);
                }, error => {
                    console.log(error);
                    reject(error);
                })
        });
    }
    // Remover caso não precisar
    // getCategories(): Promise<Category[]> {
    //     return new Promise((resolve, reject) => {
    //         this.categories = [];

    //         if (this.module == 'category') {

    //             Promise.all([this.categoryApi.getCategory(this.id), this.categoryApi.getChildren(this.id)])
    //                 .then(results => {
    //                     this.category = results[0];
    //                     this.category.children = results[1];
    //                     AppSettings.setTitle(this.category.metaTagTitle, this.titleService);
    //                     this.categories.push(this.category);
    //                     resolve(this.categories);
    //                 })
    //                 .catch(error => reject(error));
    //         }
    //         else {
    //             this.categoryApi.getTree()
    //                 .then(categories => {
    //                     this.categories = categories;
    //                     resolve(this.categories);
    //                 })
    //                 .catch(error => reject(error));
    //         }

    //     });

    // }

    prepareSearch(params): Promise<SearchResult> {
        return new Promise((resolve, reject) => {
            this.searchInput.categories = [];
            this.searchInput.brands = [];
            this.searchInput.groups = [];


            /* Set Query */
            if (params['q']) {
                this.searchInput.name = params['q'].toString();
            }
            else {
                this.searchInput.name = null;
            }

            /* Set Brands */
            if (params['brands']) {
                this.searchInput.brands = params['brands'].toString().split(',');
            }

            /* Set Categories */
            if (params['categories']) {
                this.searchInput.categories = params['categories'].toString().split(',');
            }

            /* Set Variations */
            if (params['variations']) {
                this.searchInput.variations = params['variations'].toString().split(',');
            }

            /* Set Options */
            if (params['options']) {
                this.searchInput.options = params['options'].toString().split(',');
            }
            /* Set Groups */
            if (params['groups']) {
                this.searchInput.groups = params['groups'].toString().split(',');
            }

            if (this.module == 'category') {
                this.searchInput.categories.push(params['id']);
            }

            if (this.module == 'brand') {
                this.searchInput.brands.push(params['id']);
            }
            /*Busca grupos*/
            if (this.module == 'group') {
                this.searchInput.groups.push(params['id']);
            }

            if (params['sort']) {
                this.sort = Number.parseInt(params['sort']);
                this.searchInput.sort = this.sort;
            }

            if (params['maximumPrice']) {
                this.priceRange.maximumPrice = Number.parseFloat(params['maximumPrice']);
                this.maximumPrice = this.priceRange.maximumPrice.toFixed(2).replace('.', ',');
            }

            if (params['minimumPrice']) {
                this.priceRange.minimumPrice = Number.parseFloat(params['minimumPrice']);
                this.minimumPrice = this.priceRange.minimumPrice.toFixed(2).replace('.', ',');
            }

            this.search(this.searchInput, this.page, this.pageSize)
                .then(results => resolve(results))
                .catch(error => reject(error));
        });
    }


    search(searchInput: Search, page: number, pageSize: number): Promise<SearchResult> {
        if (Number.parseFloat(this.maximumPrice) > 0)
            searchInput.priceRange.maximumPrice = Number.parseFloat(this.maximumPrice);
        if (Number.parseFloat(this.minimumPrice) > 0)
            searchInput.priceRange.minimumPrice = Number.parseFloat(this.minimumPrice);

        return this.service.searchFor(searchInput, page, pageSize);
    }

    findChildrenCategory(category: Category, id: string) {
        let found = category.children.filter(x => x.id == id)[0];
        if (found)
            this.filterModel.categories.push(found);

        category.children.forEach(c => this.findChildrenCategory(c, id));
    }

    buildFilterModel() {
        this.filterModel = new Filter();
        this.searchInput.categories.forEach(id => {
            let found = (this.categories) ? this.categories.filter(x => x.id == id)[0] : null;
            if (found) {
                this.filterModel.categories.push(found);
            }

            if (this.categories) {
                this.categories.forEach(c => {
                    this.findChildrenCategory(c, id);
                });
            }
        });

        this.searchInput.brands.forEach(id => {
            let brand = this.brands.filter(x => x.id == id)[0];
            if (brand) {
                this.filterModel.brands.push(brand);
            }
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

        if (this.filterIsEmpty()) {
            this.brandApi.getAll()
                .subscribe(brands => {
                    this.filterModel.brands = brands;
                });
            this.categoryApi.getTree()
                .subscribe(categories => {
                    this.filterModel.categories = categories;
                });
        }
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

    getModule(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.route.url
                .map(value => value)
                .subscribe(segments => {
                    let path = segments[0].path;
                    if (path == 'categoria') {
                        this.module = 'category';
                        this.categoryApi.getCategory(this.id)
                            .subscribe(category => {
                                this.titleService.setTitle(category.metaTagTitle);
                                this.metaService.addTags([
                                    { name: 'title', content: category.metaTagTitle },
                                    { name: 'description', content: category.metaTagDescription }
                                ]);
                                this.category = category;
                            }, error => console.log(error));
                    }
                    else if (path == 'marcas') {
                        this.module = 'brand';
                        this.getBrand();
                    }
                    else if (path == 'marca') {
                        this.module = 'brand';
                        this.getBrand();
                    }
                    else if (path == 'grupo') {
                        this.module = 'group';
                        this.getGroup(this.id);
                    }
                    else {
                        this.module = 'filter';
                        this.titleService.setTitle('Buscar Produtos');
                    }

                    resolve(this.module)
                });
        });
    }

    /* Compare */
    countCompare(): boolean {

        if (isPlatformBrowser(this.platformId)) {
            let compare = JSON.parse(localStorage.getItem('compare'));

            if (!compare)
                return false;
            else if (compare.length > 1)
                return true;
            else
                return false;
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

    navigate(page: number, event = null) {
        if (event) {
            event.preventDefault();
        }
        let url = this.buildUrl()
        url = `${url};page=${page}`;
        this.parentRouter.navigateByUrl(url);
    }

    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;
    }

    filterBox() {
        if (isPlatformBrowser(this.platformId)) {
            $('.btn-filter').click(function (event) {
                $('.showcase-department, #filterby-title').hide();
                $('#filter').fadeIn();
                return false;
            });
            $('#filter .lvl1-link').click(function (event) {
                var $lvl2 = $(this).parents('li').find('.lvl2');
                $lvl2.fadeIn();
                return false;
            });
            $('#filter .btn-back').click(function (event) {
                var $lvl2 = $(this).parents('.lvl2');
                $lvl2.fadeOut();
                return false;
            });
            $('#filter .btn-close, #filter label').click(function (event) {
                $('#filter .lvl2').fadeOut();
                $('#filter').fadeOut();
                $('.showcase-department, #filterby-title').show();
                return false;
            });
        }
        else {
            return false;
        }
    }

    showFilter(collection: any[]): boolean {
        if (!collection) {
            return false;
        }
        else {
            if (collection.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    applyResults(results: SearchResult) {
        this.loading = false;
        if (results.products) {
            this.products = results.products;
        } else {
            this.products = [];
        }
        if (results.facetBrands) {
            this.brands = results.facetBrands;
        } else {
            this.brands = [];
        }
        if (results.facetOptions) {
            this.options = results.facetOptions;
        } else {
            this.options = [];
        }
        if (results.facetVariations) {
            this.variations = results.facetVariations;
        } else {
            this.variations = [];
        }
        if (results.facetPrice) {
            this.priceRange = results.facetPrice;
            this.maximumPrice = results.facetPrice.maximumPrice.toFixed(2).replace('.', ',');
            this.minimumPrice = results.facetPrice.minimumPrice.toFixed(2).replace('.', ',');
        } else {
            this.priceRange = new PriceRange();
            this.maximumPrice = '0,00';
            this.minimumPrice = '0,00';
        }
        if (results.facetCategories) {
            this.arrangeCategories(results.facetCategories);
        } else {
            this.categories = null;
        }
        this.pagination = results.pagination;
        this.numPages = this.pagination.TotalPages;
        this.buildFilterModel();
    }

    arrangeCategories(facetCategories: Category[]) {
        this.categoriesArranged = false;
        this.categoryApi.getTree()
            .subscribe(categories => {
                facetCategories.forEach(category => {
                    let found: Category = categories.find(c => c.id == category.id);
                    if (found) {
                        category.children = [];
                        found.children.forEach(child => {
                            let childFound: Category = facetCategories.find(f => f.id == child.id);
                            if (childFound)
                                category.children.push(childFound);
                        });

                        this.categories.push(category);
                    }
                });
                this.categoriesArranged = true;
            }, error => {
                console.log(error);
                this.categoriesArranged = true;
            });

    }

    getStore(): Store {
        return this.store;
    }

    private fetchStore(): Promise<Store> {
        if (isPlatformBrowser(this.platformId)) {
            let store: Store = JSON.parse(sessionStorage.getItem('store'));
            if (store && store.domain == AppConfig.DOMAIN) {
                return new Promise((resolve, reject) => {
                    resolve(store);
                });
            }
        }
        return this.fetchStoreFromApi();
    }

    private fetchStoreFromApi(): Promise<Store> {
        return new Promise((resolve, reject) => {
            this.storeApi.getStore()
                .subscribe(response => {
                    if (isPlatformBrowser(this.platformId)) {
                        sessionStorage.setItem('store', JSON.stringify(response));
                    }
                    resolve(response);
                }, error => {
                    reject(error);
                });
        });
    }

    isCatalog(): boolean {
        if (this.globals.store.modality == EnumStoreModality.Budget)
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
        else if (this.isCatalog() && this.globals.store.settings.find(s => s.type == 3 && s.status == true))
            return true;
        else return false;
    }

    filterByPriceRange(event = null) {
        if (event)
            event.preventDefault();
        this.searchInput.priceRange = new PriceRange(Number.parseFloat(this.maximumPrice), Number.parseFloat(this.minimumPrice));
        this.listProducts(this.page, null);
    }

    removeFilterByPriceRange(event = null) {
        if (event) {
            event.preventDefault();
        }
        this.searchInput.priceRange = new PriceRange(0, 0);
        this.listProducts(this.page, null);

    }

    removeFilterQuery(event = null) {
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

    getRoute(collection: string, filter: any): string {
        let reload: boolean = false;
        return this.createFilterUrl(collection, filter.id, filter.name, reload, this.searchInput, Number.parseFloat(this.maximumPrice), Number.parseFloat(this.minimumPrice), (this.sort) ? this.sort : null);
    }

}