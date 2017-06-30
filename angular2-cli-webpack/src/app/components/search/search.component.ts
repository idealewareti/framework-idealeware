import { Component, OnInit, OnDestroy, AfterContentChecked } from '@angular/core';
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
import { ProductService } from "app/services/product.service";
import { Variation } from "app/models/product/variation";
import { Group } from "app/models/group/group";
import { VariationOption } from "app/models/product/product-variation-option";
import { StoreService } from "app/services/store.service";
import { Store } from "app/models/store/store";
import { Pagination } from "app/models/pagination";
import { SearchResult } from "app/models/search/search-result";
import { EnumSort } from "app/enums/sort.enum";
import { EnumSortPage } from "app/enums/sort-page.enum";
import { GroupService } from "app/services/group.service";

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'search',
    templateUrl: '../../views/search.component.html',
})
export class SearchComponent implements OnInit {
    private path: string;
    private id: string;
    private niceName: string;
    private module: string;
    private loading: boolean = true;
    private filterModel: Filter;
    private showAll: boolean = false;
    private orderBy: string = null;
    private sortBy: string[] = [];
    private pageSize: number = 9;
    private pages: number[];
    private orderSearchOptions: Object[] = [
        { label: 'Mais Relevantes', value: EnumSort.MostRelevant },
        { label: 'Ordem Alfabética Crescente', value: EnumSort.AToZ },
        { label: 'Ordem Alfabética Decrescente', value: EnumSort.ZToA },
        
    ];

    private orderPageOptions: Object[] = [
        { label: 'Mais Relevantes', value: -1 },
        { label: 'Menores Preços', value: EnumSortPage.PriceLowToHogh },
        { label: 'Maiores Preços', value: EnumSortPage.PriceHighToLow },
        
    ];
    private store: Store;
    pagination: Pagination;
    products: Product[] = [];
    category: Category;
    categories: Category[] = [];
    brand: Brand;
    brands: Brand[] = [];
    variations: Variation[] = [];
    options: VariationOption[] = []
    groups: Group[] = [];
    page: number = 1;
    numPages: number = 0;
    sortPage: EnumSortPage = -1;

    private searchInput: Search;

    constructor(
        private route: ActivatedRoute,
        private parentRouter: Router,
        private categoryApi: CategoryService,
        private brandApi: BrandService,
        private groupApi: GroupService,
        private service: SearchService,
        private productService: ProductService,
        private storeService: StoreService,
        private titleService: Title,
        private metaService: Meta,
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
                        return this.getProducts(params);
                    })
                    .then(results => {
                        this.loading = false;
                        this.products = results.products;
                        this.pagination = results.pagination;
                        this.numPages = this.pagination.TotalPages;

                        this.getBrandsFromProducts(this.products);
                        this.getVariationsAndOptionsFromProducts(this.products);
                        this.getCategoryFromProducts(this.products);
                        this.buildFilterModel();
                    })
                    // .then(categories => {
                    //     this.getBrand();
                    //     this.buildFilterModel();
                    //     window.scrollTo(0, 0); // por causa das hash url
                    // })
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

            this.storeService.getInfo()
            .then(response => this.store = response)
            .catch(error => console.log(error));
    }

    ngAfterContentChecked() { }

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
        this.searchInput.sortPage = this.sortPage;
        this.search(this.searchInput, page, this.pageSize)
        .then(result => {
            this.products = result.products;
            this.pagination = result.pagination;
            this.numPages = this.pagination.TotalPages;
            window.scrollTo(0, 0);
        });
        

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

    private buildUrl(): string{
        let url = '/buscar';
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
        
        return url;
    }

    private setFilter() {
        let url = this.buildUrl();
        this.parentRouter.navigateByUrl(url);
    }

    /* Validadores*/
    public hasFilters(): boolean {
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

    public isChecked(collection, id): boolean {
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

    private getBrand() {
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

    private getCategory(id: string): Promise<Category> {
        return new Promise((resolve, reject) => {
            this.categoryApi.getCategory(id)
                .then(category => {
                    AppSettings.setTitle(category.metaTagTitle, this.titleService);
                    this.metaService.addTags([
                        { name: 'title', content: category.metaTagTitle },
                        { name: 'description', content: category.metaTagDescription }
                    ]);
                    resolve(category);
                })
                .catch(error => reject(error));
        })
    }

    private getGroup(id: string): Promise<Group>{
        return new Promise((resolve, reject) => {
            this.groupApi.getById(id)
            .then(group => {
                AppSettings.setTitle(group.metaTagTitle, this.titleService);
                this.metaService.addTags([
                    { name: 'title', content: group.metaTagTitle },
                    { name: 'description', content: group.metaTagDescription }
                ]);
                resolve(group);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            })
        });
    }

    private getCategories(): Promise<Category[]> {
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

    private getBrandsFromProducts(products: Product[]) {
        this.brands = [];
        products.forEach(p => {
            if (this.brands.findIndex(b => b.id == p.brand.id) == -1)
                this.brands.push(p.brand);
        })
    }

    private getCategoryFromProducts(products: Product[]) {
        this.categories = [];
        products.forEach(p => {
            p.categories.forEach(category => {
                if (this.categories.findIndex(c => c.id == category.id) == -1) {
                    this.categories.push(category);
                }
            })
        })
    }

    getVariationsAndOptionsFromProducts(products: Product[]) {
        this.variations = [];
        this.options = [];

        products.forEach(p => {
            p.skus.forEach(sku => {
                sku.variations.forEach(variation => {
                    if (this.variations.findIndex(v => v.id == variation.id) == -1) {
                        this.variations.push(variation);
                    }

                    if (this.options.findIndex(o => o.id == variation.option.id) == -1) {
                        this.options.push(variation.option);
                    }
                })
            });
        })
    }

    private getProducts(params): Promise<SearchResult> {
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

            this.search(this.searchInput, this.page, this.pageSize)
            .then(results => resolve(results))
            .catch(error => reject(error));
        });
    }


    search(searchInput: Search, page: number, pageSize: number): Promise<SearchResult>{
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

    private filterIsEmpty() {
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

    private getModule(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.route.url
                .map(value => value)
                .subscribe(segments => {
                    let module = segments[0].path;

                    switch (module) {
                        case 'categoria':
                            this.module = 'category';
                            this.getCategory(this.id);
                            break;
                        case 'marcas':
                            this.module = 'brand'
                            break;
                        case 'marca':
                            this.module = 'brand'
                            break;
                        case 'grupo':
                            this.module = 'group';
                            this.getGroup(this.id);
                            break;
                        default:
                            this.module = 'filter';
                            AppSettings.setTitle('Buscar Produtos', this.titleService)
                            break;
                    }

                    resolve(this.module)
                });
        });
    }

    /* Compare */
    public countCompare(): boolean {
        let compare = JSON.parse(localStorage.getItem('compare'));
        if (!compare)
            return false;
        else if (compare.length > 1)
            return true;
        else
            return false;
    }

    public getCompare() {
        let compare = JSON.parse(localStorage.getItem('compare'));
        return compare;

    }

    public queryCompare() {
        let compare = JSON.parse(localStorage.getItem('compare'));

        return compare.reduce((a, b) => {
            return a.id.concat(',' + b.id);
        });
    }
    public closeCompare() {
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

    navigate(page: number, event = null){
        if(event)
            event.preventDefault();

        let url = this.buildUrl()
        url = `${url};page=${page}`;

        this.parentRouter.navigateByUrl(url);
    }

    /* Mobile */
    public isMobile(): boolean {
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
}