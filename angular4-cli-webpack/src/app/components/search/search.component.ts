import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Category } from "app/models/category/category";
import { Brand } from "app/models/brand/brand";
import { Product } from "app/models/product/product";
import { CategoryService } from "app/services/category.service";
import { Search } from "app/models/search/search";
import { SearchService } from "app/services/search.service";
import { BrandService } from "app/services/brand.service";
import { AppSettings } from "app/app.settings";
import { Title, Meta } from "@angular/platform-browser";
import { Filter } from "app/models/search/search-filter";
import { Variation } from "app/models/product/variation";
import { Group } from "app/models/group/group";
import { VariationOption } from "app/models/product/product-variation-option";
import { Store } from "app/models/store/store";
import { Pagination } from "app/models/pagination";
import { SearchResult } from "app/models/search/search-result";
import { EnumSort } from "app/enums/sort.enum";
import { GroupService } from "app/services/group.service";
import { PriceRange } from "app/models/search/price-range";
import { Globals } from "app/models/globals";
import { EnumStoreModality } from "app/enums/store-modality.enum";

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'search',
    templateUrl: '../../views/search.component.html',
})
export class SearchComponent implements OnInit {
    path: string;
    id: string;
    niceName: string;
    module: string;
    loading: boolean = true;
    filterModel: Filter;
    showAll: boolean = false;
    orderBy: string = null;
    sortBy: string[] = [];
    pageSize: number = 9;
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
    priceRange: PriceRange = new PriceRange(0, 0);
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
        private service: SearchService,
        private titleService: Title,
        private metaService: Meta,
        private globals: Globals
    ) { }

    ngOnInit() {
        this.route.params
        .map(params => params)
        .subscribe(params => {
            /* Unsetting filter */
            this.id = params['id'];
            this.searchInput = new Search();
            this.filterModel = new Filter();
            this.category = new Category();
            this.categories = [];
            this.sort = EnumSort.MostRelevant;
            this.priceRange = new PriceRange(0, 0);

            AppSettings.setTitle('Buscar Produtos', this.titleService);

            this.getModule()
            .then(module => {
                this.module = module;
                if (params['id'])
                    this.id = params['id'];

                this.orderBy = (params['orderBy']) ? params['orderBy'] : undefined;
                if(params['page'])
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
                window.scrollTo(0, 0); // por causa das hash url
                this.getCategories()
                    .then(categories => this.buildFilterModel());
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
        if(event)
            event.preventDefault();
        this.searchInput.sort = this.sort;
        // this.search(this.searchInput, page, this.pageSize)
        // .then(result => {
        //     this.applyResults(result);
        //     this.buildUrl();
        //     window.scrollTo(0, 0);
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

    buildUrl(reload: boolean = false): string{
        let url = '';
        if(this.module == 'category' && !reload)
            url = `/categoria/${this.category.id}/${this.category.niceName}`;
        else if(this.module == 'brand' && !reload)
            url = `/marcas/${this.brand.id}/${this.brand.niceName}`;
        else if(this.module == 'group' && !reload)
            url = `/grupo/${this.group.id}/${this.group.niceName}`;
        else{
            url = '/buscar';
            if (this.searchInput && this.searchInput.name)
                url += `;q=${this.searchInput.name}`;
            if (this.searchInput.categories.length > 0)
                url += `;categories=${this.searchInput.categories.toString()}`;
            if (this.searchInput.brands.length > 0)
                url += `;brands=${this.searchInput.brands.toString()}`;
            if (this.searchInput.variations.length > 0)
                url += `;variations=${this.searchInput.variations.toString()}`;
            if (this.searchInput.options.length > 0)
                url += `;options=${this.searchInput.options.toString()}`;
            if(this.searchInput.groups.length > 0)
                url += `;groups=${this.searchInput.groups.toString()}`;
            if(this.searchInput.priceRange.maximumPrice > 0)
                url += `;maximumPrice=${this.priceRange.maximumPrice.toString()}`;
            if(this.searchInput.priceRange.minimumPrice > 0)
                url += `;minimumPrice=${this.priceRange.minimumPrice.toString()}`;
        }

        if(this.sort)
            url += `;sort=${this.sort}`

        return url;
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
            if (this.searchInput.brands.findIndex(brand => brand == id) > -1)
                return true
            else return false;
        }
        else if (collection == 'category') {
            if (this.searchInput.categories.findIndex(category => category == id) > -1)
                return true
            else return false;
        }
        else if (collection == 'variation') {
            if (this.searchInput.variations.findIndex(variation => variation == id) > -1)
                return true
            else return false;
        }
        else if (collection == 'option') {
            if (this.searchInput.options.findIndex(option => option == id) > -1)
                return true
            else return false;
        }

        else return false;
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

    getBreadCrump(): Category{
        if(this.module == 'category' && this.category.isSet())
            return this.category;
        else
            return null;
    }

    getBrand() {
        this.brand = new Brand();
        if (this.module == 'brand') {
            this.brandApi.getBrand(this.id)
                .then(brand => {
                    this.brand = brand;
                    AppSettings.setTitle(brand.metaTagTitle, this.titleService);
                    this.metaService.addTags([
                        { name: 'title', content: brand.metaTagTitle },
                        { name: 'description', content: brand.metaTagDescription }
                    ]);
                })
                .catch(error => console.log(error));
        }
    }

    getGroup(id: string): Promise<Group>{
        return new Promise((resolve, reject) => {
            this.groupApi.getById(id)
            .then(group => {
                AppSettings.setTitle(group.metaTagTitle, this.titleService);
                this.metaService.addTags([
                    { name: 'title', content: group.metaTagTitle },
                    { name: 'description', content: group.metaTagDescription }
                ]);
                this.group = group;
                resolve(group);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            })
        });
    }

    getCategories(): Promise<Category[]> {
        return new Promise((resolve, reject) => {
            this.categories = [];

            if (this.module == 'category') {

                Promise.all([this.categoryApi.getCategory(this.id), this.categoryApi.getChildren(this.id)])
                    .then(results => {
                        this.category = results[0];
                        this.category.children = results[1];
                        AppSettings.setTitle(this.category.metaTagTitle, this.titleService);
                        this.categories.push(this.category);
                        resolve(this.categories);
                    })
                    .catch(error => reject(error));
            }
            else {
                this.categoryApi.getTree()
                    .then(categories => {
                        this.categories = categories;
                        resolve(this.categories);
                    })
                    .catch(error => reject(error));
            }

        });

    }

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

            if(params['sort']){
                this.sort = Number.parseInt(params['sort']);
                this.searchInput.sort = this.sort;
            }

            if(params['maximumPrice'])
                this.priceRange.maximumPrice = Number.parseFloat(params['maximumPrice']);

            if(params['minimumPrice'])
                this.priceRange.minimumPrice = Number.parseFloat(params['minimumPrice']);

            this.search(this.searchInput, this.page, this.pageSize)
            .then(results => resolve(results))
            .catch(error => reject(error));
        });
    }


    search(searchInput: Search, page: number, pageSize: number): Promise<SearchResult>{
        if(this.priceRange.maximumPrice > 0)
            searchInput.priceRange.maximumPrice = this.priceRange.maximumPrice
        if(this.priceRange.minimumPrice > 0)
            searchInput.priceRange.minimumPrice = this.priceRange.minimumPrice

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
            let found = this.categories.filter(x => x.id == id)[0];
            if (found)
                this.filterModel.categories.push(found);

            this.categories.forEach(c => {
                this.findChildrenCategory(c, id);
            });
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

        if (this.filterIsEmpty()) {
            Promise.all([this.brandApi.getAll(), this.categoryApi.getTree()])
                .then(results => {
                    this.filterModel.brands = results[0];
                    this.filterModel.categories = results[1];
                })
                .catch(error => console.log(error));
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
                    if(path == 'categoria'){
                        this.module = 'category';
                        this.categoryApi.getCategory(this.id)
                        .then(category => {
                            AppSettings.setTitle(category.metaTagTitle, this.titleService);
                            this.metaService.addTags([
                                { name: 'title', content: category.metaTagTitle },
                                { name: 'description', content: category.metaTagDescription }
                            ]);
                            this.category = category;
                        })
                        .catch(error => console.log(error));
                    }
                    else if(path == 'marcas'){
                        this.module = 'brand'
                    }
                    else if(path == 'marca'){
                        this.module = 'brand'
                    }
                    else if(path == 'grupo'){
                        this.module = 'group';
                        this.getGroup(this.id);
                    }
                    else{
                        this.module = 'filter';
                        AppSettings.setTitle('Buscar Produtos', this.titleService)
                    }

                    resolve(this.module)
                });
        });
    }

    /* Compare */
    countCompare(): boolean {
        let compare = JSON.parse(localStorage.getItem('compare'));
        if (!compare)
            return false;
        else if (compare.length > 1)
            return true;
        else
            return false;
    }

    getCompare() {
        let compare = JSON.parse(localStorage.getItem('compare'));
        return compare;

    }

    queryCompare() {
        let compare = JSON.parse(localStorage.getItem('compare'));
        let query: string = '';
        let i = 0;
        compare.forEach(item => {
            query += `${item.id}${(i < compare.length - 1) ? ',' : ''}`;
            i++;
        });

        return query;
    }
    closeCompare() {
        localStorage.removeItem('compare');
    }

    /* Events */
    changeOrdernation(event) {
        this.listProducts(this.page);
    }

    resultsFound(): string{
        if(this.pagination.TotalCount == 1)
            return `${this.pagination.TotalCount} produto`;
        else if(this.pagination.TotalCount > 1)
            return `${this.pagination.TotalCount} produtos`;
        else
            return `Nenhum produto`;
    }

    totalItens(): number{
        if(this.pagination)
            return this.pagination.TotalCount;
        else
            return 0;
    }

    navigate(page: number, event = null){
        if(event)
            event.preventDefault();

        let url = this.buildUrl()
        url = `${url};page=${page}`;

        this.parentRouter.navigateByUrl(url);
        window.scrollTo(0, 0); // por causa das hash url
    }

    isMobile(): boolean {
        return AppSettings.isMobile();
    }

    filterBox() {
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

    showFilter(collection: any[]): boolean{
        if(!collection)
            return false;
        else{
            if(collection.length > 0)
                return true;
            else return false;
        }
    }

    applyResults(results: SearchResult){
        this.loading = false;
        this.products = results.products;
        this.brands = results.facetBrands;
        this.categories = results.facetCategories;
        this.options = results.facetOptions;
        this.variations = results.facetVariations;
        this.pagination = results.pagination;
        this.numPages = this.pagination.TotalPages;
        this.priceRange = results.facetPrice;

        this.buildFilterModel();
    }

    getStore(): Store{
        return this.globals.store;
    }

    isCatalog(): boolean{
        if(this.globals.store.modality == EnumStoreModality.Budget)
            return true;
        else return false;
    }

    showValues(): boolean {
        if (!this.isCatalog())
            return true;
        else if (this.isCatalog() && this.globals.store.settings.find(s => s.type == 3 && s.status == true))
            return true;
        else return false;
    }

    filterByPriceRange(event = null){
        if(event)
            event.preventDefault();
        this.searchInput.priceRange = this.priceRange;
        this.listProducts(this.page, null);
    }

    removeFilterByPriceRange(event = null){
        if(event)
            event.preventDefault();
        this.searchInput.priceRange = new PriceRange(0, 0);
        this.listProducts(this.page, null);
        
    }
 
}