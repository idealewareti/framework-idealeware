import {Component, Input, AfterViewChecked, OnInit, OnDestroy} from '@angular/core';
import {AppSettings} from '../app.settings';
import { Product } from '../_models/product/product';
import { Router } from "@angular/router";

//declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'product-grid-item',
    templateUrl: '/views/product_grid_item.component.html'
})
export class ProductGridItemComponent {
    @Input() product: Product;
    @Input() productUrl: string;
    @Input() showCompare: boolean = false;
    coverImg: string;
    mediaPath: string = `${AppSettings.MEDIA_PATH}/products`;
    parcelValue: number;
    price: number = 0;
    promotionalPrice: number = 0;

    constructor(private parentRouter: Router) {

    }

    ngOnInit(){
        this.coverImg = this.getCoverImage();
        this.parcelValue = this.getStalmentValue();
        this.productUrl = `/produto/${this.product.skuBase.id}/${this.product.niceName}`;
        this.price = this.product.skuBase.price;
        this.promotionalPrice = this.product.skuBase.promotionalPrice;
    }

    getCoverImage(){
        let image: string;
        if(this.product.pictures && this.product.pictures.length > 0){
            let picture = this.product.pictures.filter(img => img.skuId == this.product.skuBase.id && img.position == 0)[0];
            if(picture)
                image =  `${AppSettings.MEDIA_PATH}/products/${picture.showcase}`;
            else if(this.product.pictures.filter(img => img.productId == this.product.id && img.position == 0).length > 0){
                picture = this.product.pictures.filter(img => img.productId == this.product.id && img.position == 0)[0];
                image  = `${AppSettings.MEDIA_PATH}/products/${picture.showcase}`;
            }
            else
             image =`${AppSettings.ROOT_PATH}/assets/imagesno-image.jpg`;
        }
        else{
            image = `${AppSettings.ROOT_PATH}/assets/imagesno-image.jpg`;
        }
        return image;
    }

    getStalmentValue(){
        let price = 0;
        if(this.product.skuBase.promotionalPrice && this.product.skuBase.promotionalPrice > 0)
            price = this.product.skuBase.promotionalPrice;
        else price = this.product.skuBase.price;
        return price / this.product.installmentLimit;
    }

    public quickView(){
        
        let quickviewId = `#quickview-${this.product.id}`;

        $('#to-compare').hide();

        $(quickviewId).clone().appendTo("body");

        $(quickviewId).fadeIn( function(){

            $('.btn-close-clickview').click(function(){
                $('.quickview-box').fadeOut(function(){
                    let $owl = $('#image-thumb');
                    $owl.trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
                    $owl.find('.owl-stage-outer').children().unwrap();
                    // $owl.children('img').each(function(){
                    //     $.removeData($(this), 'elevateZoom');
                    // });
                    let zoomContainer = document.querySelector('.zoomContainer');
                    if(zoomContainer)
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
                responsive : {
                    0 : { items: 2 },
                    768 : { items: 2 },
                    992 : { items: 3 },
                    1200 : { items: 4 }
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

      public addToCompare(event, product){
          event.preventDefault();
        let compare = JSON.parse(localStorage.getItem('compare'));
        if(!compare)
            compare = [];
        if(!this.isComparing(product.id) && compare.length < 3){ 
           compare.push({id:product.id});
           localStorage.setItem('compare', JSON.stringify(compare));
        }
        else if (this.isComparing(product.id)){
            let index = compare.findIndex(p => p.id == product.id);
            if(index > -1){
               compare.splice(index, 1);
               localStorage.setItem('compare', JSON.stringify(compare));
            }            
        }
    }

    public isComparing(id:string):boolean{
     let compare = JSON.parse(localStorage.getItem('compare'));
        if(!compare)
            return false;
        else if(compare.filter(p => p.id == id).length > 0)
            return true;
        else
         return false;
    }

    public isMobile(): boolean{
        return AppSettings.isMobile();
    }
    
}