import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomPaintManufacturer } from "../../../models/custom-paint/custom-paint-manufacturer";
import { CustomPaintService } from "../../../services/custom-paint.service";
import { CustomPaintCombination } from "../../../models/custom-paint/custom-paint-combination";
import { CartManager } from "../../../managers/cart.manager";
import { Store } from "../../../models/store/store";
import { StoreService } from "../../../services/store.service";
import { Globals } from "../../../models/globals";
import { EnumStoreModality } from '../../../enums/store-modality.enum';
import { isPlatformBrowser } from '@angular/common';
import { CustomPaintColor } from '../../../models/custom-paint/custom-paint-color';
import { CustomPaintVariation } from '../../../models/custom-paint/custom-paint-variation';
import { CustomPaintOption } from '../../../models/custom-paint/custom-paint-option';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Pagination } from '../../../models/pagination';
import { ModelReference } from '../../../models/model-reference';
import { AppConfig } from '../../../app.config';

declare var swal: any;
declare var toastr: any;

@Component({
    moduleId: module.id,
    selector: 'app-custom-paint-base',
    templateUrl: '../../../template/custom-paint/custom-paint-base/custom-paint-base.html',
    styleUrls: ['../../../template/custom-paint/custom-paint-base/custom-paint-base.scss']
})
export class CustomPaintBaseComponent implements OnInit {
    manufacturer: CustomPaintManufacturer = new CustomPaintManufacturer();
    manufacuterId: string;
    optionId: string = null;
    colorCode: string;
    modality: EnumStoreModality = EnumStoreModality.Ecommerce;
    color: CustomPaintColor;
    paints: CustomPaintCombination[] = [];
    variation: CustomPaintVariation = new CustomPaintVariation();
    mediaPath: string;
    store: Store;
    filterForm: FormGroup;
    page: number = 1;
    pageSize: number = 9;
    initialPage: number = 1;
    lastPage: number = 1;
    pagination: Pagination;
    pages: ModelReference[] = [];

    constructor(
        private service: CustomPaintService,
        private storeService: StoreService,
        private titleService: Title,
        private route: ActivatedRoute,
        private parentRouter: Router,
        private manager: CartManager,
        formBuilder: FormBuilder,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.mediaPath = 'static/custompaint';
        this.filterForm = formBuilder.group({
            filterName: [''],
            filterOptionId: ['']
        })
    }

    ngOnInit() {
        this.route.params
            .map(params => params)
            .subscribe((params) => {
                if (params['page']) {
                    this.page = (Number.parseInt(params['page']) < 1) ? 1 : Number.parseInt(params['page']);
                }
                this.manufacuterId = params['manufacturer'];
                this.colorCode = params['color'];
                this.optionId = params['option'];
                this.fetchStore()
                    .then(store => {
                        this.store = store;
                        this.modality = this.store.modality;
                        return this.getManufacturer(this.manufacuterId)
                    })
                    .then(manufacturer => {
                        this.manufacturer = manufacturer;
                        this.titleService.setTitle(`Cores Personalizadas ${this.manufacturer.name} - Selecione seu produto`);
                        return this.getVariation(this.manufacuterId);
                    })
                    .then(variation => {
                        this.variation = variation;
                        let todos = new CustomPaintOption();
                        todos.id = '0';
                        todos.name = 'Todos';
                        this.variation.options.unshift(todos);
                        return this.getPaints(this.manufacuterId, this.colorCode, this.optionId);
                    })
                    .then(paints => {
                        if (paints.length == 0) {
                            if (isPlatformBrowser(this.platformId)) {
                                swal('Sem produtos disponíveis', 'Não há tintas para esta cor', 'warning');
                                this.parentRouter.navigate(['/corespersonalizadas', this.manufacuterId]);
                            }
                        }
                        this.paints = paints;
                    })
                    .catch(error => {
                        console.log(error);
                        if (isPlatformBrowser(this.platformId)) {
                            swal('Erro', `Falha ao carregar os produtos: ${error.text()}`, 'error');
                            this.parentRouter.navigate(['/corespersonalizadas', this.manufacuterId]);
                        }
                    });
            });
    }

    /* Loaders */
    getManufacturer(id: string): Promise<CustomPaintManufacturer> {
        return new Promise((resolve, reject) => {
            this.service.getManufacturers()
                .subscribe(manufacturers => {
                    let manufacturer: CustomPaintManufacturer = manufacturers.filter(m => m.manufacturer === id)[0];
                    resolve(manufacturer);
                }, error => reject(error));
        });
    }

    getVariation(id: string): Promise<CustomPaintVariation> {
        return new Promise((resolve, reject) => {
            this.service.getVariations(id)
                .subscribe(variation => resolve(variation), error => reject(error));
        })
    }

    getPaints(manufacturer: string, colorCode: string, optionId: string): Promise<CustomPaintCombination[]> {
        return new Promise((resolve, reject) => {
            if (optionId && optionId != '0') {
                this.service.getPaintsByOption(manufacturer, colorCode, optionId, this.page, this.pageSize)
                    .then(search => {
                        this.pagination = search.pagination;
                        this.createPages();
                        resolve(search.combinations);
                    })
                    .catch(error => {
                        console.log(error);
                        reject(error);
                    });
            }
            else {
                this.service.getPaints(manufacturer, colorCode, this.page, this.pageSize)
                    .then(search => {
                        this.pagination = search.pagination;
                        this.createPages();
                        resolve(search.combinations);
                    })
                    .catch(error => {
                        console.log(error);
                        reject(error);
                    });
            }
        });
    }

    showValues(): boolean {
        if (this.modality == EnumStoreModality.Ecommerce) {
            return true;
        }
        else if (this.modality == EnumStoreModality.Budget && this.store.settings.find(s => s.type == 3 && s.status == true)) {
            return true;
        }
        else return false;
    }

    getPaintPicture(paint: CustomPaintCombination): string {
        if (paint.picture) {
            return `${this.store.link}/${this.mediaPath}/${paint.picture}`;
        }
        return '/assets/images/no-image.jpg';
    }

    /* Actions */
    purchase(paint: CustomPaintCombination, event = null) {
        if (isPlatformBrowser(this.platformId)) {
            if (event) {
                event.preventDefault();
            }
            this.manager.purchasePaint(localStorage.getItem('cart_id'), paint, this.manufacturer.manufacturer, 1)
                .then(cart => {
                    this.parentRouter.navigateByUrl('/carrinho');
                })
                .catch(error => {
                    let message = '';
                    if (error.status === 0) {
                        message = 'Conexão perdida';
                    } else if (error.status === 500) {
                        message = 'Erro no servidor';
                    } else if (error.text().split('|').length > 1) {
                        message = error.text().split('|')[1].replace(/"/g, '');
                    } else {
                        message = error.text().replace(/"/g, '');
                    }
                    console.log(error);
                    swal('Erro ao adicionar ao carrinho', message, 'error');
                });
        }
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
            this.storeService.getStore()
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

    getColor(color: CustomPaintColor): string {
        if (/^\S{6}$/.test(color.rgb)) {
            return `#${color.rgb}`;
        }
        return `rgb(${color.rgb})`;
    }

    filterPaints(): CustomPaintCombination[] {
        let paints: CustomPaintCombination[] = this.paints;
        // if (this.filterName) {
        //     paints = paints.filter(p => p.name.toLowerCase().indexOf(this.filterName.toLowerCase()) !== -1);
        // }
        // if (this.filterOptionId && this.filterOptionId != '0') {
        //     paints = paints.filter(p => p.variation.optionId == this.filterOptionId);
        // }
        return paints;
    }

    /**
     * Retorna o total de páginas
     * @returns {number} 
     * @memberof CustomPaintBaseComponent
     */
    numPages(): number {
        if (this.pagination && this.pagination.TotalPages) {
            return this.pagination.TotalPages;
        }
        return 0;
    }

    createPages() {
        this.pages = [];
        if (this.numPages() > 10) {
            this.initialPage = (this.page - 2 < 1) ? 1 : this.page - 2;
            this.lastPage = (this.page + 2 > this.numPages()) ? this.numPages() : this.page + 2;
            for (let i = this.initialPage; i <= this.lastPage; i++) {
                let page = new ModelReference({ 'id': i.toString(), 'name': i.toString() });
                this.pages.push(page);
            }
            if (this.pages.length > 2 && Number.parseInt(this.pages[0].id) > 3) {
                this.pages.unshift(new ModelReference({ 'id': '1', 'name': '1' }), new ModelReference({ 'id': '2', 'name': '2' }), new ModelReference({ 'id': this.pages[0].id, 'name': '...' }));
            }
            else if (this.pages.length > 2 && Number.parseInt(this.pages[0].id) <= 3) {
                for (let i = Number.parseInt(this.pages[0].id) - 1; i > 0; i--)
                    this.pages.unshift(new ModelReference({ 'id': i, 'name': i }));
            }
            if (Number.parseInt(this.pages[this.pages.length - 1].id) < this.numPages()) {
                let last = this.numPages() - 2;
                if (Number.parseInt(this.pages[this.pages.length - 1].id) < this.numPages() - 3) {
                    this.pages.push(new ModelReference({ 'id': last, 'name': '...' }));
                }
                for (let i = last + 1; i <= this.numPages(); i++)
                    this.pages.push(new ModelReference({ 'id': i, 'name': i }));
            }
        }
        else {
            for (let i = 1; i <= this.numPages(); i++) {
                let page = new ModelReference({ 'id': i.toString(), 'name': i.toString() });
                this.pages.push(page);
            }
        }
    }

    navigate(page, event = null) {
        if (event) {
            event.preventDefault();
        }
        this.page = (Number.parseInt(page) > 0) ? Number.parseInt(page) : 1;

        if (this.optionId) {
            this.parentRouter.navigate(['/corespersonalizadas', this.manufacuterId, this.colorCode, this.optionId, { 'page': this.page }]);
        }
        else {
            this.parentRouter.navigate(['/corespersonalizadas', this.manufacuterId, this.colorCode, { 'page': this.page }]);
        }
    }

    changeOption(event = null) {
        if (event) {
            event.preventDefault();
        }
        if (this.optionId != '0') {
            this.parentRouter.navigate(['/corespersonalizadas', this.manufacuterId, this.colorCode, this.optionId]);
        }
        else {
            this.parentRouter.navigate(['/corespersonalizadas', this.manufacuterId, this.colorCode]);
        }
    }

    byOption(item1, item2) {
        return item1 == this.optionId;
    }
}