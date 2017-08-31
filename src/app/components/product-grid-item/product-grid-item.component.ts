import { Component, Input, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { AppSettings } from 'app/app.settings';
import { Product } from 'app/models/product/product';
import { Router } from "@angular/router";
import { Store } from "app/models/store/store";
import { EnumStoreModality } from "app/enums/store-modality.enum";
import { Sku } from "app/models/product/sku";
import { PaymentManager } from "app/managers/payment.manager";
import { Payment } from "app/models/payment/payment";
import { PagseguroInstallment } from "app/models/pagseguro/pagseguro-installment";
import { PaymentMethod } from "app/models/payment/payment-method";
import { ProductPicture } from "app/models/product/product-picture";
import { Globals } from "app/models/globals";

declare var $: any;
declare var PagSeguroDirectPayment: any;

@Component({
    moduleId: module.id,
    selector: 'product-grid-item',
    templateUrl: '../../views/product-grid-item.component.html'
})
export class ProductGridItemComponent {
    @Input() product: Product;
    @Input() productUrl: string;
    @Input() showCompare: boolean = false;
    @Input() store: Store;

    sku: Sku = new Sku();
    coverImg: string;
    alternativeImg: string;
    mediaPath: string;
    parcelValue: number;
    price: number = 0;
    promotionalPrice: number = 0;
    private alternative: boolean = false;

    constructor(
        private parentRouter: Router, 
        private paymentManager: PaymentManager,
        private globals: Globals
    ) {}

    ngOnInit() {
        this.mediaPath = `${this.globals.store.link}/static/products`;

        if(!this.product.skuBase.available || this.product.skuBase.stock <= 0){
            let availables: Sku[] = this.product.skus.filter(sku => (sku.stock > 0) && (sku.available));
            if(availables.length > 0)
                this.sku = availables[0];
            else
                this.sku = this.product.skuBase;
        }
        else
            this.sku = this.product.skuBase;

        this.coverImg = (this.getCoverImage()['showcase']) ?`${this.mediaPath}/${this.getCoverImage().showcase}` : '/assets/images/no-image.jpg';
        this.productUrl = this.getRoute();
        this.price = this.sku.price;
        this.promotionalPrice = this.sku.promotionalPrice;
        this.alternativeImg = this.sku.alternativePicture['id'] ? `${this.mediaPath}/${this.sku.alternativePicture.showcase}` : this.coverImg;

        this.paymentManager.getInstallments(this.sku)
        .then(payment => {
            this.product.installmentText = this.paymentManager.getInstallmentText(payment, payment.paymentMethods[0]);
        })
        .catch(error => console.log(error));
    }

    ngAfterViewChecked() {
        if (!this.alternative) {
            this.alternative = true;
            $(`#sku_${this.sku.id} .thumb`).on("mouseover", function () {
                let src = ($('img', this).data('alternative') === '')
                    ? $('img', this).data('original')
                    : $('img', this).data('alternative');
                $('img', this).attr('src', src);
                $(this).on("mouseleave", function () {
                    src = $('img', this).data('original')
                    $('img', this).attr('src', src);
                });
            });
        }
    }

    getCoverImage(): ProductPicture{
       return this.product.skuBase.picture;
    }

    quickView() {

        let quickviewId = `#quickview-${this.product.id}`;

        $('#to-compare').hide();

        $(quickviewId).clone().appendTo("body");

        $(quickviewId).fadeIn(function () {

            $('.btn-close-clickview').click(function () {
                $('.quickview-box').fadeOut(function () {
                    let $owl = $('#image-thumb');
                    $owl.trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
                    $owl.find('.owl-stage-outer').children().unwrap();
                    // $owl.children('img').each(function(){
                    //     $.removeData($(this), 'elevateZoom');
                    // });
                    let zoomContainer = document.querySelector('.zoomContainer');
                    if (zoomContainer)
                        $('.zoomContainer').remove();
                    $('#to-compare').show();

                });
            });

            // THUMBS
            $(".quickview-content #image-thumb").owlCarousel({
                items: 4,
                loop: true,
                dots: false,
                nav: true,
                navText: [
                    '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                    '<i class="fa fa-angle-right" aria-hidden="true"></i>'
                ],
                autoplay: true,
                autoplayTimeout: 5000,
                autoplayHoverPause: true,
                responsive: {
                    0: { items: 2 },
                    768: { items: 2 },
                    992: { items: 3 },
                    1200: { items: 4 }
                }
            });

            $(".quickview-content #product-image-zoom").elevateZoom({
                zoomType: "inner",
                gallery: 'image-thumb',
                cursor: 'pointer',
                galleryActiveClass: 'active',
                imageCrossfade: true,
            });
        });
    }

    addToCompare(event, product) {
        event.preventDefault();
        let compare = JSON.parse(localStorage.getItem('compare'));
        if (!compare)
            compare = [];
        if (!this.isComparing(product.id) && compare.length < 3) {
            compare.push({ id: product.id });
            localStorage.setItem('compare', JSON.stringify(compare));
        }
        else if (this.isComparing(product.id)) {
            let index = compare.findIndex(p => p.id == product.id);
            if (index > -1) {
                compare.splice(index, 1);
                localStorage.setItem('compare', JSON.stringify(compare));
            }
        }
    }

    isComparing(id: string): boolean {
        let compare = JSON.parse(localStorage.getItem('compare'));
        if (!compare)
            return false;
        else if (compare.filter(p => p.id == id).length > 0)
            return true;
        else
            return false;
    }

    isMobile(): boolean {
        return AppSettings.isMobile();
    }

    getModality(): number{
        if(this.store)
            return this.store.modality;
        else return -1;
    }

    isBudget(): boolean{
        if(this.store && this.store.modality == EnumStoreModality.Budget)
            return true;
        else return false;
    }

    isAvailable(): boolean{
        if(this.store.modality == EnumStoreModality.Budget && this.sku.available)
            return true;
        else if(this.store.modality == EnumStoreModality.Ecommerce && this.sku.available && this.sku.stock > 0)
            return true;
        else return false;
    }

    isMundiPagg(gateway: Payment): boolean{
        if(this.paymentManager.isMundiPagg(gateway))
            return true;
        else return false;
    }

    isMercadoPago(gateway: Payment): boolean{
        if(gateway.name.toLowerCase() == 'mercadopago')
            return true;
        else return false;
    }

    isPagseguro(gateway: Payment): boolean{
        if(gateway.name.toLowerCase() == 'pagseguro')
            return true;
        else return false;
    }

    getRoute(): string{
        return `/${this.product.niceName}-${this.sku.id}`;
    }
}