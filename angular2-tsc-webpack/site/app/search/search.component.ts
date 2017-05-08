import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Category } from "../_models/category/category";
import { Brand } from "../_models/brand/brand";
import { Product } from "../_models/product/product";
import { CategoryService } from "../_services/category.service";
import { Search } from "../_models/search/search";
import { SearchService } from "../_services/search.service";
import { BrandService } from "../_services/brand.service";
import { AppSettings } from "../app.settings";
import { Title } from "@angular/platform-browser";
import { Filter } from "../_models/search/search-filter";
import { ProductService } from "../_services/product.service";
import { Variation } from "../_models/product/variation";
import { Group } from "../_models/group/group";
import { VariationOption } from "../_models/product/product-variation-option";
import { Sort } from "../_models/search/sort";

//declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'search',
    templateUrl: '/views/search.component.html',
})
export class SearchComponent implements OnInit {
    private path: string;
    private id: string;
    private niceName: string;
    private module: string;
    private loading: boolean = true;
    private results: number = 0;
    private filterModel: Filter;
    private showAll: boolean = false;
    private orderBy: string = null;
    private sortBy: string[] = [];
    private allProducts: Product[] = [];
    private pageSize: number = 9;
    private numPages = 0;
    private pages: number[];

    products: Product[] = [];
    category: Category;
    categories: Category[] = [];
    brand: Brand;
    brands: Brand[] = [];
    variations: Variation[] = [];
    options: VariationOption[] = []
    groups: Group[] = [];
    page: number = 1;

    private searchInput: Search;

    constructor(
        private route: ActivatedRoute,
        private parentRouter: Router,
        private categoryApi: CategoryService,
        private brandApi: BrandService,
        private service: SearchService,
        private productService: ProductService,
        private titleService: Title,
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
                AppSettings.setTitle('Carregando...', this.titleService);

                this.getModule()
                    .then(module => {
                        this.module = module;
                        if (params['id'])
                            this.id = params['id'];

                        this.orderBy = params['orderBy'];
                        this.allProducts = [];
                        this.products = [];
                        return this.getProducts(params);
                    })
                    .then(products => {
                        this.loading = false;
                        this.results = products.length;
                        this.allProducts = products;

                        this.numPages = Math.ceil((this.allProducts.length) / this.pageSize);
                        this.createPages();
                        this.listProducts(this.page);
                        this.getBrandsFromProducts(products);
                        this.getVariationsAndOptionsFromProducts(products);
                        //Adicionei esses campos e apaguei o getCategoria
                        this.getCategoryFromProducts(products);
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
                        this.results = 0;
                        this.variations = [];
                        this.options = [];
                        this.brands = [];
                        window.scrollTo(0, 0); // por causa das hash url
                        this.getCategories()
                            .then(categories => this.buildFilterModel());
                    });

            });
    }

    ngAfterContentChecked() { }

    ngAfterViewChecked() {
        if (this.isMobile())
            this.filterBox();
    }

    /* Paginations */
    listProducts(page: number, event = null) {
        if (event)
            event.preventDefault();
        let cursor = 0;

        if (page <= this.numPages && page >= 1) {
            if (page == 1) {
                cursor = 0
                this.products = this.allProducts.slice(cursor, this.pageSize);
            }
            else {
                cursor = (page - 1) * this.pageSize;
                if (this.allProducts.length > cursor + this.pageSize)
                    this.products = this.allProducts.slice(cursor, this.pageSize + cursor);
                else
                    this.products = this.allProducts.slice(cursor);
            }

            this.page = page;
            window.scrollTo(0, 0); // por causa das hash url

        }
    }

    createPages() {
        this.pages = [];
        for (let i = 1; i <= this.numPages; i++)
            this.pages.push(i);
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
            if (this.searchInput.variations.findIndex(b => b == item) < 0)
                this.searchInput.variations.push(item);
            else {
                this.searchInput.variations.splice(this.searchInput.variations.findIndex(b => b == item), 1);
            }
        }

        if (collection == 'option') {
            if (this.searchInput.options.findIndex(b => b == item) < 0)
                this.searchInput.options.push(item);
            else {
                this.searchInput.options.splice(this.searchInput.options.findIndex(b => b == item), 1);
            }
        }

        this.setFilter();
    }

    public clearFilter(event) {
        event.preventDefault();

        this.searchInput = new Search();
        this.setFilter();
    }

    private setFilter() {
        let url = '/buscar';
        if (this.searchInput.name)
            url += `;q=${this.searchInput.name}`;
        if (this.searchInput.categories.length > 0)
            url += `;categories=${this.searchInput.categories.toString()}`;
        if (this.searchInput.brands.length > 0)
            url += `;brands=${this.searchInput.brands.toString()}`;
        if (this.searchInput.variations.length > 0)
            url += `;variations=${this.searchInput.variations.toString()}`;
        if (this.searchInput.options.length > 0)
            url += `;options=${this.searchInput.options.toString()}`;

        this.parentRouter.navigateByUrl(url);
    }

    /* Validadores*/
    public hasFilters(): boolean {
        if (this.filterModel.categories.length > 0
            || this.filterModel.brands.length > 0
            || this.filterModel.variations.length > 0
            || this.filterModel.options.length > 0
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
                })
                .catch(error => console.log(error));
        }
    }

    private getCategory(id: string): Promise<Category> {
        return new Promise((resolve, reject) => {
            this.categoryApi.getCategory(id)
                .then(category => resolve(category))
                .catch(error => reject(error));
        })
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

    private getProducts(params): Promise<Product[]> {
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

            this.service.searchFor(this.searchInput)
                .then(results => {
                    resolve(results);
                })
                .catch(error => reject(error));
        });
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
                            break;
                        case 'marcas':
                            this.module = 'brand'
                            break;
                        case 'marca':
                            this.module = 'brand'
                            break;
                        case 'grupo':
                            this.module = 'group'
                            break;
                        default:
                            this.module = 'filter';
                            AppSettings.setTitle('Buscar Produdos', this.titleService)
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
        if (this.orderBy) {
            //  this.sortBy = [];
            //  this.sortBy.push(`${this.orderBy.charAt(0)}skuBase.${this.orderBy.substring(1)}`);

            this.allProducts = this.allProducts.sort((a, b) => {
                let key = this.orderBy.substring(1);


                if (this.orderBy.charAt(0) == '-')
                    return a.skuBase[key] - b.skuBase[key];
                else return b.skuBase[key] - a.skuBase[key];

            });

            this.listProducts(this.page);
        }
    }

    public isMobile(): boolean {
        return AppSettings.isMobile();
    }

    /* Mobile */
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