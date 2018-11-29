import { Component, PLATFORM_ID, Inject, Input } from '@angular/core';
import { Shipping } from '../../../models/shipping/shipping';
import { StoreManager } from '../../../managers/store.manager';
import { isPlatformBrowser } from '@angular/common';
import { Branch } from '../../../models/branch/branch';
import { Intelipost } from "../../../models/intelipost/intelipost";
import { IntelipostDeliveryOption } from "../../../models/intelipost/intelipost-delivery-option";
import { AppConfig } from '../../../app.config';
import { BranchService } from '../../../services/branch.service';
import { ProductShippingModel } from '../../../models/product/product-shipping';
import { IntelipostIdentification } from '../../../models/intelipost/intelipost-identification';
import { Product } from '../../../models/product/product';
import { Store } from '../../../models/store/store';
import { ProductManager } from '../../../managers/product.manager';


declare var swal: any;

@Component({
    selector: "product-shipping",
    templateUrl: "../../../templates/product/product-shipping/product-shipping.component.html",
    styleUrls: ["../../../templates/product/product-shipping/product-shipping.component.scss"]
})
export class ProductShipping {
    private intelipost: Intelipost;
    public deliveryOptions: IntelipostDeliveryOption[] = [];
    public branches: Branch[] = [];
    private shippingSelected: Shipping = new Shipping();
    private productShipping: ProductShippingModel;
    private intelipostIdentification: IntelipostIdentification;

    @Input() zipCode: string;
    @Input() store: Store;
    @Input() product: Product;
    @Input() quantity: number;
    loading: boolean = false;

    constructor(
        private storeManager: StoreManager,
        private productManager: ProductManager,
        private branchService: BranchService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnChanges(): void {
        if (isPlatformBrowser(this.platformId)) {
            if (this.zipCode && this.zipCode.split('').length == 9) {
                this.calculate(null);
            } else {
                this.deliveryOptions = [];
                this.branches = [];
            }
        }
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.zipCode && localStorage.getItem('customer_zipcode'))
                this.zipCode = localStorage.getItem('customer_zipcode');
        }
    }

    inputShipping(event) {
        if (isPlatformBrowser(this.platformId)) {
            if (this.zipCode.split('').length == 9) {
                this.calculate(event);
            } else {
                this.deliveryOptions = [];
                this.branches = [];
            }
        }
    }

    sendRequest(): Promise<Intelipost> {
        if (isPlatformBrowser(this.platformId)) {
            return new Promise((resolve, reject) => {
                let zipCode = Number(this.zipCode.replace('-', ''));

                this.intelipostIdentification = new IntelipostIdentification();
                this.intelipostIdentification.session = localStorage.getItem('session_id');
                this.intelipostIdentification.pageName = AppConfig.NAME;
                this.intelipostIdentification.url = this.store.link;

                this.productShipping = new ProductShippingModel();
                this.productShipping.Identification = this.intelipostIdentification;
                this.productShipping.ZipCode = zipCode.toString();
                this.product.skuBase.price = this.validPromotionalPrice();
                this.productShipping.Products = this.product.skuBase;
                this.productShipping.Products.quantity = this.quantity;
                this.productShipping.Products.additionalFreightPrice = this.product.additionalFreightPrice;
                this.productShipping.Products.daysProcessing = this.product.daysProcessing;
                
                return this.productManager.getShippingProduct(this.productShipping)
                    .subscribe(intelipost => {
                        resolve(intelipost);
                    }, error => reject(error))
            });
        }
    }

    /**
     * Obtem as filiais
     * 
     * @param {string} zipcode 
     * @memberof CheckoutShippingComponent
     */
    getBranches(zipcode: string) {
        if (isPlatformBrowser(this.platformId)) {
            zipcode = zipcode.replace('-', '');
            this.branchService.getBranches(zipcode)
                .subscribe(branches => {
                    this.branches = branches;
                });
        }
    }

    calculate(event) {
        if (isPlatformBrowser(this.platformId)) {
            if (event) event.preventDefault();
            if (!this.zipCode) {
                swal({ title: 'Erro!', text: 'CEP Inválido', type: 'warning', confirmButtonText: 'OK' });
            }
            else if (this.zipCode.length < 9) {
                swal({ title: 'Erro!', text: 'CEP Inválido', type: 'warning', confirmButtonText: 'OK' });
            }
            else {
                this.deliveryOptions = [];
                this.branches = [];
                this.loading = true;
                this.sendRequest()
                    .then(response => {
                        this.intelipost = response;
                        this.deliveryOptions = this.intelipost.content.delivery_options;
                        this.loading = false;
                    })
                    .catch(error => {
                        if (error.status == 400)
                            swal({
                                title: 'Erro ao calcular o frete!',
                                text: "Sem opções de entrega viável. Por favor, verifique se os códigos postais estão corretos!",
                                type: 'warning',
                                confirmButtonText: 'OK'
                            });
                        else
                            swal({ title: 'Erro!', text: 'Não foi possível calcular o frete', type: 'error', confirmButtonText: 'OK' });
                        this.loading = false;
                    });
                this.getBranches(this.zipCode);
            }
        }
    }

    validPromotionalPrice() {
        if (isPlatformBrowser(this.platformId)) {
            return this.product.skuBase.promotionalPrice > 0
                ? this.product.skuBase.promotionalPrice
                : this.product.skuBase.price;
        }
    }
}