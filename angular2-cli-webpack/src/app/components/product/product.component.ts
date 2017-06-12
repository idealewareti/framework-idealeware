import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AppSettings } from 'app/app.settings';
import { Title, DomSanitizer, SafeResourceUrl, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Product } from 'app/models/product/product';
import { Sku } from 'app/models/product/sku';
import { ProductPicture } from 'app/models/product/product-picture';
import { SelfColor } from 'app/models/self-color/self-color';
import { Cart } from 'app/models/cart/cart';
import { CartItem } from 'app/models/cart/cart-item';
import { Category } from 'app/models/category/category';
import { ProductService } from 'app/services/product.service';
import { CartManager } from 'app/managers/cart.manager';
import { ProductAwaited } from "app/models/product-awaited/product-awaited";
import { ProductRating } from "app/models/product-rating/product-rating";
import { CustomerProductRating } from "app/models/product-rating/customer-product-rating";
import { CustomerService } from "app/services/customer.service";
import { Customer } from "app/models/customer/customer";
import { ProductRatingCreate } from "app/models/product-rating/product-rating-create";
import { PaymentService } from "app/services/payment.service";
import { Service } from "app/models/product-service/product-service";
import { StoreService } from "app/services/store.service";
import { Store } from "app/models/store/store";

declare var $: any;
declare var S: any;
declare var swal: any;

@Component({
    moduleId: module.id,
    selector: 'product',
    templateUrl: '../../views/product.component.html'
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
    allOptionsSelected: boolean = false;
    coverImg: ProductPicture = new ProductPicture();
    mediaPath: string = `${AppSettings.MEDIA_PATH}/products/`;

    store: Store;
    modality: number = -1;
    showValuesProduct: boolean = false;
    totalNote: number = 0;

    @Input() selfColor: SelfColor;
    @Input() quantity: number = 1;
    @Input() areaSizer: number = 0;



    constructor(
        private route: ActivatedRoute,
        private storeService: StoreService,
        private parentRouter: Router,
        private titleService: Title,
        private service: ProductService,
        private serviceCustomer: CustomerService,
        private manager: CartManager,
        private location: Location,
        private sanitizer: DomSanitizer,
    ) {
        this.product = null;
    }

    /* Lifecycle events */
    ngOnInit() {
        this.storeService.getInfo()
            .then(response => {
                this.modality = response.modality;
                this.store = response;
                this.showValuesProduct = this.showValues(response);
            });
        window.scrollTo(0, 0); // por causa das hash url
        this.route.params
            .map(params => params)
            .subscribe((params) => {
                this.id = params['id'];
                this.selfColor = new SelfColor();
                this.getProductBySku(this.id);
            });

        $('body').addClass('product');
    }

    public isMobile(): boolean {
        return AppSettings.isMobile()
    }

    public accordion(id) {
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

    /* Cart Events */
    public addToCart() {
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

            this.manager.purchase(this.product, this.sku, this.quantity, this.feature)
                .then(() => {
                    if (this.services.length > 0)
                        this.services.forEach(service => {
                            this.manager.addService(service.id, service.quantity);
                        });

                    this.parentRouter.navigateByUrl('/carrinho');
                })
                .catch(error => {
                    swal({
                        title: "Falha ao adicionar o produto ao carrinho",
                        text: error._body,
                        type: "warning",
                        confirmButtonText: "OK"
                    });
                    console.log(error);
                });
        }

    }

    /* Get SKU */
    public open(event, item: string) {
        if (event)
            event.preventDefault()
        this.setCurrentSku(item);
        this.location.replaceState(`/produto/${item}/${this.product.niceName}`);
    }

    handleSkuUpdated(event: Sku) {
        this.open(null, event.id);
    }

    handleOptionChanged(event: boolean) {
        this.allOptionsSelected = event;
    }

    private setCurrentSku(skuId: string = null) {
        this.allOptionsSelected = true;
        return new Promise((resolve, reject) => {
            if (skuId)
                this.sku = this.product.getSku(skuId);
            else
                this.sku = this.product.getSku(this.id);
            this.parcelValue = this.getInstallmentValue();
            this.getImages();
            this.getCoverImage();
            resolve(this.product);
        })

    }

    private getProductBySku(id) {
        this.service.getProductBySku(id)
            .then(product => {
                this.product = product;
                this.setTitle(this.product, this.sku);
                if (product.video.videoEmbed)
                    this.videoSafeUrl = this.videoURL();
                this.setCurrentSku(id);
            })
            .catch(error => {
                this.product = null;
                console.log(error);
                this.parentRouter.navigateByUrl('/404');
            });
    }

    private setTitle(product: Product, sku: Sku = null) {
        let title = (product.metaTagTitle) ? product.metaTagTitle : product.name;
        AppSettings.setTitle(title, this.titleService);
    }

    /* Breadcrump */
    public getBreadCrump(): Category {
        return this.product.baseCategory;
    }

    private arrangeCategories() {
        let categories = this.product.categories;
    }

    /* Installment Simulator */
    private getInstallmentValue() {
        let price = 0;
        if (this.sku.promotionalPrice && this.sku.promotionalPrice > 0)
            price = this.sku.promotionalPrice
        else price = this.sku.price;
        return price / this.product.installmentLimit;

    }

    /* Images */
    private getCoverImage() {
        if (this.product.hasCoverImage(this.sku.id)) {
            this.coverImg = this.product.getSkuCoverImage(this.sku.id);
        }
        else return null;

    }

    private getImages() {
        this.pictures = this.product.getSkuImages(this.sku.id);
    }

    /* Product Awaited */
    public receiveProductsAwaited(event) {
        event.preventDefault();
        let productName = this.product.name;
        this.sku.variations.forEach(v => {
            productName += `-${v.name} : ${v.option.name}`;
        });

        this.productsAwaited.productName = productName;
        this.productsAwaited.skuId = this.sku.id;
        this.service.createProductAwaited(this.productsAwaited)
            .then(newsletter => {
                swal({
                    title: 'Avise-me quando chegar',
                    text: 'E-mail cadastrado com sucesso.',
                    type: 'success',
                    confirmButtonText: 'OK'
                });
                this.productsAwaited = new ProductAwaited();
            })
            .catch(error => {
                swal({
                    title: 'Erro ao cadastrar email',
                    text: 'Não foi possível cadastrar seu email',
                    type: 'error',
                    confirmButtonText: 'OK'
                });
                console.log(error);
            });
    }


    /* Loss Percentage */
    public getLossPercentage(event = null) {
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
    public getAreaSizer(event = null) {
        if (event)
            event.preventDefault();

        if (this.areaSizer > 0 && this.product.areaSizer > 0) {
            this.quantity = Math.ceil(this.areaSizer / this.product.areaSizer);
        }
    }

    /* Rating */
    public getRating() {
        if (this.productsRating) {
            let total = 0;
            this.productsRating.customers.forEach(a => {
                total += a.note;
            });
            this.totalNote = Math.ceil(total/ this.productsRating.customers.length);
            return this.productsRating.customers.length;
        }
        else return 0;
    }

    public handleRating(event) {
        this.productsRating = event;
    }

    /* Color Picker Events */
    public colorPicker(event) {
        event.preventDefault();
        window.scrollTo(0, 850);
    }

    public handleFeatureUpdated(event) {
        this.selfColor = event;
        this.feature = `${this.selfColor.code} - ${this.selfColor.name}`;
        window.scrollTo(0, 0); // por causa das hash url
    }

    /* Services */
    public handleServiceUpdated(event) {
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

    videoURL() {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.product.video.videoEmbed);
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
}