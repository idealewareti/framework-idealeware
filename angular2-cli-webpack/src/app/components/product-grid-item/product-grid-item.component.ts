import { Component, Input, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { AppSettings } from 'app/app.settings';
import { Product } from 'app/models/product/product';
import { Router } from "@angular/router";
import { StoreService } from "app/services/store.service";
import { Store } from "app/models/store/store";
import { EnumStoreModality } from "app/enums/store-modality.enum";
import { Sku } from "app/models/product/sku";

declare var $: any;

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
    mediaPath: string = `${AppSettings.MEDIA_PATH}/products`;
    parcelValue: number;
    price: number = 0;
    promotionalPrice: number = 0;
    private alternative: boolean = false;

    constructor(private parentRouter: Router) {}

    ngOnInit() {

        if(!this.product.skuBase.available || this.product.skuBase.stock <= 0){
            let availables: Sku[] = this.product.skus.filter(sku => (sku.stock > 0) && (sku.available));
            if(availables.length > 0)
                this.sku = availables[0];
            else
                this.sku = this.product.skuBase;
        }
        else
            this.sku = this.product.skuBase;

        this.coverImg = (this.getCoverImage()['showcase']) ?`${AppSettings.MEDIA_PATH}/products/${this.getCoverImage().showcase}` : '/assets/images/no-image.jpg';
        this.productUrl = `/produto/${this.sku.id}/${this.product.niceName}`;
        this.price = this.sku.price;
        this.promotionalPrice = this.sku.promotionalPrice;
        this.alternativeImg = this.sku.alternativePicture ? `${AppSettings.MEDIA_PATH}/products/${this.sku.alternativePicture.showcase}` : '';
    }

    ngAfterViewChecked() {
        if (!this.alternative) {
            this.alternative = true;
            $(".thumb img").on("mouseover", function () {
                let src = ($(this).data('alternative') === '')
                    ? $(this).data('original')
                    : $(this).data('alternative');
                $(this).attr('src', src);
                $(this).on("mouseleave", function () {
                    src = $(this).data('original')
                    $(this).attr('src', src);
                });
            });
        }
    }

    getCoverImage() {
       return this.product.getSkuCoverImage(this.sku.id);
    }

    public quickView() {

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

    public addToCompare(event, product) {
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

    public isComparing(id: string): boolean {
        let compare = JSON.parse(localStorage.getItem('compare'));
        if (!compare)
            return false;
        else if (compare.filter(p => p.id == id).length > 0)
            return true;
        else
            return false;
    }

    public isMobile(): boolean {
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
        if(this.sku.available && this.sku.stock > 0)
            return true;
        else 
            return false;
    }
}