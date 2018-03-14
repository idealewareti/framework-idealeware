import { Component, Input, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Title, DomSanitizer, SafeResourceUrl, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, isPlatformBrowser } from '@angular/common';
import { Product } from '../../../models/product/product';
import { Sku } from '../../../models/product/sku';
import { ProductPicture } from '../../../models/product/product-picture';
import { Cart } from '../../../models/cart/cart';
import { CartItem } from '../../../models/cart/cart-item';
import { Category } from '../../../models/category/category';
import { ProductService } from '../../../services/product.service';
import { CartManager } from '../../../managers/cart.manager';
import { ProductAwaited } from "../../../models/product-awaited/product-awaited";
import { ProductRating } from "../../../models/product-rating/product-rating";
import { CustomerProductRating } from "../../../models/product-rating/customer-product-rating";
import { CustomerService } from "../../../services/customer.service";
import { Customer } from "../../../models/customer/customer";
import { ProductRatingCreate } from "../../../models/product-rating/product-rating-create";
import { Service } from "../../../models/product-service/product-service";
import { Store } from "../../../models/store/store";
import { RelatedProductsService } from "../../../services/related-products.service";
import { EnumStoreModality } from "../../../enums/store-modality.enum";
import { RelatedProductGroup } from "../../../models/related-products/related-product-group";
import { PaymentManager } from "../../../managers/payment.manager";
import { Globals } from "../../../models/globals";
import { SelfColor } from "../../../models/self-color/self-color";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validEmail } from '../../../directives/email-validator/email-validator.directive';
import { AppCore } from '../../../app.core';
import { ProductAwaitedService } from '../../../services/product-awaited.service';
import { error } from 'util';
import { ProductManager } from '../../../managers/product.manager';
import { AppConfig } from '../../../app.config';
import { StoreManager } from '../../../managers/store.manager';

declare var $: any;
declare var S: any;
declare var swal: any;
declare var toastr: any;

@Component({
    moduleId: module.id,
    selector: 'app-product',
    templateUrl: '../../../template/product/product/product.html',
    styleUrls: ['../../../template/product/product/product.scss']
})
export class ProductComponent {

    id: string;
    productsRating: ProductRating = new ProductRating();
    productsAwaited: ProductAwaited = new ProductAwaited();
    parcelValue: number;
    product: Product = new Product();
    sku: Sku = new Sku();
    pictures: ProductPicture[] = [];
    feature: string = null;
    services: Service[] = [];
    videoSafeUrl: SafeResourceUrl;
    fileGuideSafeUrl: SafeResourceUrl;
    allOptionsSelected: boolean = false;
    coverImg: ProductPicture = new ProductPicture();
    mediaPath: string;
    related: RelatedProductGroup = new RelatedProductGroup();
    modality: EnumStoreModality = -1;
    showValuesProduct: boolean = false;
    totalNote: number = 0;
    notFound: boolean = false;
    installment: string = '';
    selfColor: SelfColor = null;
    productAwaitedForm: FormGroup;
    store: Store;

    @Input() quantity: number = 1;
    @Input() areaSizer: number = 0;

    constructor(
        formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private service: ProductService,
        private manager: ProductManager,
        private storeManager: StoreManager,
        private serviceAwaited: ProductAwaitedService,
        private relatedService: RelatedProductsService,
        private cartManager: CartManager,
        private parentRouter: Router,
        private titleService: Title,
        private metaService: Meta,
        private location: Location,
        private sanitizer: DomSanitizer,
        private paymentManager: PaymentManager,
        private globals: Globals,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.productAwaitedForm = new FormBuilder().group({
            name: ['', Validators.required],
            email: ['', Validators.compose([
                Validators.required,
                validEmail()
            ])],
        });
    }

    /* Lifecycle events */
    ngOnInit() {
        this.storeManager.getStore()
            .then(store => {
                this.store = store;
                this.mediaPath = `${this.store.link}/static/products/`;
                this.modality = this.store.modality;
                this.showValuesProduct = this.showValues(this.store);

                if (isPlatformBrowser(this.platformId)) {
                    $('body').addClass('product');
                    window.scrollTo(0, 0);
                }

                this.route.params
                    .map(params => params)
                    .subscribe((params) => {
                        if (params['id']) {
                            this.id = params['id'];
                            this.getProductBySku(this.id);
                        }
                        else if (params['product']) {
                            let paramProduct = params['product'];
                            this.id = paramProduct.substr(params['product'].length - 36);
                            if (this.isGuid(this.id))
                                this.getProductBySku(this.id);
                            else {
                                let routeParam = decodeURI(this.parentRouter.url).slice(1);
                                this.parentRouter.navigateByUrl(`/redirect/${routeParam}`);
                            }
                        }
                    });
            })
            .catch(error => {
                console.log(error);
            });
    }

    ngOnDestroy() {
        if (isPlatformBrowser(this.platformId)) {
            this.metaService.removeTag("name='title'");
            this.metaService.removeTag("name='description'");
            $('body').removeClass('product');
        }
    }

    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;
    }

    accordion(id) {
        if (isPlatformBrowser(this.platformId)) {
            var $button = $(id).siblings('button');
            if ($(id).length) {
                if ($(id).is(':visible')) {
                    $(id).slideUp();
                    $button.find('.fa').removeClass('fa-chevron-up').addClass('fa-chevron-down');
                } else {
                    $(id).slideDown();
                    $button.find('.fa').removeClass('fa-chevron-down').addClass('fa-chevron-up');
                }
            }
        }
    }

    /* Cart Events */
    addToCart() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.product.selfColor && !this.feature) {
                swal({
                    title: "Cor necessária",
                    text: "É necessário escolher uma cor para o produto",
                    type: "warning",
                    confirmButtonText: "OK"
                });
            }
            else if (!this.allOptionsSelected) {
                swal({
                    title: 'Característica não selecionada',
                    text: 'Selecione as características desejadas antes de adicionar ao carrinho',
                    type: 'warning',
                    confirmButtonText: 'OK'
                });
            }
            else {
                this.cartManager.purchase(localStorage.getItem('cart_id'), this.product, this.sku, this.quantity, this.feature)
                    .then(() => {
                        toastr['success']('Produto adicionado ao carrinho');
                        if (this.services.length > 0)
                            this.services.forEach(service => {
                                this.cartManager.addService(service.id, service.quantity, localStorage.getItem('cart_id'));
                            });
                        this.parentRouter.navigateByUrl('/carrinho');
                    })
                    .catch(error => {
                        swal({
                            title: "Falha ao adicionar o produto ao carrinho",
                            text: error.text(),
                            type: "warning",
                            confirmButtonText: "OK"
                        });
                        console.log(error);
                    });
            }
        }
    }

    /* Get SKU */
    open(event, item: string) {
        if (event)
            event.preventDefault()
        this.setCurrentSku(item);
        this.location.replaceState(`/produto/${item}/${AppCore.getNiceName(this.product.name)}`);
    }

    handleSkuUpdated(event: Sku) {
        if (this.sku.id != event.id)
            this.open(null, event.id);
    }

    handleProductUpdated(event: Product) {
        this.product = event;
        this.sku = event.skuBase;
        this.setCurrentSku(this.sku.id);
        this.location.replaceState(`/${AppCore.getNiceName(this.product.name)}-${this.sku.id}`);
    }

    handleOptionChanged(event: boolean) {
        this.allOptionsSelected = event;
    }

    public handleFeatureUpdated(event: SelfColor) {
        this.selfColor = event;
        this.feature = `${this.selfColor.code} - ${this.selfColor.name}`;
    }

    setCurrentSku(skuId: string = null) {
        this.allOptionsSelected = true;
        return new Promise((resolve, reject) => {
            if (skuId)
                this.sku = this.manager.getSku(skuId, this.product);
            else
                this.sku = this.manager.getSku(this.id, this.product);
            this.getImages();
            this.getCoverImage();

            if (!this.isCatalog() && this.isProductAvailable())
                this.getInstallmentValue();

            resolve(this.product);
        })

    }

    getProductBySku(id) {
        this.fetchProductBySku(id)
            .then(product => {
                this.product = product;
                if (this.product.name.toLowerCase().indexOf('tinta') !== -1 && this.store.domain === 'ecommerce') {
                    this.product.selfColor = true;
                }
                if (product.videoEmbed) {
                    this.videoSafeUrl = this.createSafeUrl(this.product.videoEmbed);
                }
                if (product.fileGuide) {
                    this.fileGuideSafeUrl = this.createSafeUrl(`javascript:window.open('${this.mediaPath}${product.fileGuide}');`);
                }
                this.setCurrentSku(id);
                if (this.isProductRelated()) {
                    this.relatedService.getRelatedProductGroupById(this.product.relatedProductsId)
                        .subscribe(related => {
                            this.related = related;
                            if (this.related.products.length == 0)
                                this.product.relatedProductsId = null;
                        }, error => {
                            console.log(error);
                        });
                }
                this.setTitle(this.product, this.sku);
                this.metaService.addTags([
                    { name: 'title', content: this.product.metaTagTitle },
                    { name: 'description', content: this.product.metaTagDescription },
                    { name: 'og:image', content: this.getMainImage() }
                ]);
            })
            .catch(error => {
                this.product = null;
                console.log(error);
                this.notFound = true;
                this.titleService.setTitle('Ocorreu um erro');
            });
    }

    private setTitle(product: Product, sku: Sku = null) {
        let title = (product.metaTagTitle) ? product.metaTagTitle : product.name;
        this.titleService.setTitle(title);
    }

    /* Breadcrump */
    getBreadCrump(): Category {
        if (this.product['baseCategory'])
            return this.product.baseCategory;
        else
            return this.product.categories[0];
    }

    private arrangeCategories() {
        let categories = this.product.categories;
    }

    /* Installment Simulator */
    private getInstallmentValue() {
        if (this.product.installmentNumber == 0 && this.product.installmentValue == 0) {
            this.paymentManager.getInstallments(this.sku)
                .then(payment => {
                    this.installment = this.paymentManager.getInstallmentText(payment, payment.paymentMethods[0]);
                });
        }
        else {
            this.installment = `em ${this.product.installmentNumber}x de R$ ${this.product.installmentValue.toFixed(2).toString().replace('.', ',')}`;
        }

    }

    /* Images */
    private getCoverImage() {
        if (this.manager.hasCoverImage(this.sku.id, this.product)) {
            this.coverImg = this.manager.getSkuCoverImage(this.sku.id, this.product);
        }
        else return null;

    }

    private getImages() {
        this.pictures = this.manager.getSkuImages(this.sku.id, this.product);
    }

    /* Product Awaited */
    receiveProductsAwaited(event) {
        if (isPlatformBrowser(this.platformId)) {
            event.preventDefault();
            if (this.productAwaitedForm.invalid) {
                for (let i in this.productAwaitedForm.controls) {
                    (<any>this.productAwaitedForm.controls[i])._touched = true;
                }
                swal('Erro', 'Informe corretamente os campos informados', 'error');
                return;
            }
            else {
                let productName = this.product.name;
                this.sku.variations.forEach(v => {
                    productName += `-${v.name} : ${v.option.name}`;
                });

                this.productsAwaited.productName = productName;
                this.productsAwaited.skuId = this.sku.id;
                this.serviceAwaited.createProductAwaited(this.productsAwaited)
                    .subscribe(newsletter => {
                        swal('Avise-me quando chegar', 'E-mail cadastrado com sucesso.', 'success');
                        this.productsAwaited = new ProductAwaited();
                        this.productAwaitedForm.reset();
                    }, error => {
                        swal('Erro ao cadastrar email', 'Não foi possível cadastrar seu email', 'error');
                        console.log(error);
                    });
            }
        }
    }


    /* Loss Percentage */
    getLossPercentage(event = null) {
        if (event)
            event.preventDefault();

        if (this.product.lossPercentage > 0) {
            if (this.areaSizer > 0 && this.product.areaSizer > 0) {
                let quant = Math.ceil((this.areaSizer + this.product.lossPercentage) / this.product.areaSizer);
                this.quantity = quant;
            }
            else {
                let percentege = (this.product.lossPercentage * this.quantity);
                if (percentege <= 100) {
                    this.quantity += 1;
                }
                else {
                    this.quantity += Math.ceil((percentege / 100));
                }
            }
        }
    }

    /* Area Sizer */
    getAreaSizer(event = null) {
        if (event)
            event.preventDefault();

        if (this.areaSizer > 0 && this.product.areaSizer > 0) {
            this.quantity = Math.ceil(this.areaSizer / this.product.areaSizer);
        }
    }

    /* Rating */
    getRating() {
        if (this.productsRating) {
            let total = 0;
            this.productsRating.customers.forEach(a => {
                total += a.note;
            });
            this.totalNote = Math.ceil(total / this.productsRating.customers.length);
            return this.productsRating.customers.length;
        }
        else return 0;
    }

    handleRating(event) {
        this.productsRating = event;
    }

    /* Color Picker Events */
    colorPicker(event) {
        event.preventDefault();
    }

    /* Services */
    handleServiceUpdated(event) {
        let service = event;
        let index = this.services.findIndex(s => s.id == service.id);
        if (index > -1) {
            if (service.quantity == 0)
                this.services.splice(index);
            else
                this.services[index] = service
        }
        else if (service.quantity > 0)
            this.services.push(service);
    }

    createSafeUrl(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    showValues(store): boolean {
        if (this.modality == 1) {
            return true;
        }
        else if (this.modality == 0 && store.settings.find(s => s.type == 3 && s.status == true)) {
            return true;
        }
    }

    hasTechnicalInformation(): boolean {
        if (this.product.technicalInformation.length > 0 && this.product.technicalInformation[0].name)
            return true;
        else
            return false;
    }

    getTotalServices(): number {
        if (this.services.length <= 0)
            return 0;
        else {
            let total = 0;
            this.services.forEach(service => {
                total += service.price * service.quantity;
            });
            return total;
        }
    }

    isProductAvailable(): boolean {
        if (this.store.modality == EnumStoreModality.Budget && this.sku.available)
            return true;
        else if (this.store.modality == EnumStoreModality.Ecommerce && this.sku.available && this.sku.stock > 0)
            return true;
        else return false;
    }

    isCatalog(): boolean {
        if (this.store.modality == EnumStoreModality.Budget)
            return true;
        else return false;
    }

    isProductRelated(): boolean {
        let isGuidEmpty: boolean = (this.product.relatedProductsId) ? !AppCore.isGuidEmpty(this.product.relatedProductsId) : false;
        return isGuidEmpty;
    }

    isHiddenVariation(): boolean {
        let type = this.store.settings.find(s => s.type == 4);
        if (type)
            return type.status;
        else
            return false;
    }

    getStore(): Store {
        return this.store;
    }

    downloadGuide(event) {
        event.preventDefault();
        this.parentRouter.navigateByUrl(this.mediaPath + this.product.fileGuide);
    }

    isGuid(value: string): boolean {
        return AppCore.isGuid(value);
    }

    hasError(key: string): boolean {
        let error: boolean = (this.productAwaitedForm.controls[key].touched && this.productAwaitedForm.controls[key].invalid);
        return error;
    }

    hasFileGuide(): boolean {
        if (this.product && this.product.fileGuide) {
            return true;
        }
        return false;
    }

    hasVideo(): boolean {
        if (this.product && this.product.videoEmbed) {
            return true;
        }
        return false;
    }

    private fetchProductBySku(skuId: string): Promise<Product> {
        return new Promise((resolve, reject) => {
            this.service.getProductBySku(skuId)
                .subscribe(product => resolve(product), error => reject(error));
        });
    }

    getProduct(): Product {
        if (this.product && this.product.id) {
            return this.product;
        }
        return null;
    }

    isProductLoaded(): boolean {
        if (this.getProduct() && this.getStore()) {
            return true;
        }
        return false;
    }

    getMainImage(): string {
        if (this.sku.pictures.length > 0) {
            return `${this.store.link}/static/products/${this.sku.pictures[0].showcase}`;
        }
        else {
            return `${this.store.link}/static/store/${this.store.logo}`;
        }
    }

    /**
     * Exibe ou oculta o estoque baseado na configuração da loja
     * Default: false
     * @returns 
     * @memberof ProductComponent
     */
    showStock(): boolean {
        if (this.store) {
            if (this.isCatalog()) {
                return false;
            }
            else {
                let showStock = this.store.settings.find(s => s.type == 5);
                if (showStock && showStock.status) {
                    return true;
                }
                return false;
            }
        }
        return false;
    }
}