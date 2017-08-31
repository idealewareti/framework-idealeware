import { 
    Component, 
    OnInit, 
    Input, 
    AfterViewChecked, 
    AfterContentChecked, 
    AfterViewInit,
    OnChanges, 
    SimpleChange,
    OnDestroy,
 } from '@angular/core';
import { ProductPicture } from "app/models/product/product-picture";
import { AppSettings } from "app/app.settings";
import { Sku } from "app/models/product/sku";
import { Globals } from "app/models/globals";

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'product-gallery',
    templateUrl: '../../views/product-gallery.component.html',
    styleUrls: ['../../styles/product-gallery.component.css']
})
export class ProductGalleryComponent implements OnInit {
    
    @Input() sku: Sku = null;
    coverImg: ProductPicture = null;
    pictures: ProductPicture[] = [];
    mediaPath: string;
    private zoomChecked = false;
    
    constructor(private globals: Globals) { }

    ngOnInit() {
        this.mediaPath = `${this.globals.store.link}/static/products/`;
    }

    ngAfterViewInit() {}

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        this.pictures = this.sku.pictures;
        this.coverImg = (this.sku.pictures.length > 0) ? this.sku.pictures[0] : new ProductPicture();

        if(changes['sku']){
            this.resetGallery();
        }
    }

    ngAfterViewChecked() {
        this.buildGallery(this.pictures);
        this.imageZoom(this.coverImg);
    }

    ngOnDestroy() {
        this.destroyZoom();
    }

    /* Gallery */
    public buildGallery(pictures){
        if (pictures
            && !this.isMobile()
            && pictures.length >= 5
            && $('#image-thumb').children('li').length > 0
            && $('#image-thumb ul').children('.owl-stage-outer').length == 0
            ) {
                $("#image-thumb").owlCarousel({
                    items: 5,
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
                    responsive: { 0: { items: 2 }, 768: { items: 3 }, 992: { items: 4 }, 1200: { items: 5 } }
                });
            }
        else if(pictures
            && !this.isMobile()
            && pictures.length < 5
        ) {
            $('#image-thumb').removeClass('owl-carousel').removeClass('owl-theme');
        }

        if(pictures
            && this.isMobile()
            && $('.image-group').children('.image').length > 0 
            && $('#image-thumb ul').children('.owl-stage-outer').length == 0)
            {
                $(".image-group").owlCarousel({
                    items: 1,
                    loop: true,
                    nav: false,
                    navText: [
                        '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                        '<i class="fa fa-angle-right" aria-hidden="true"></i>'
                    ],
                    dots: false,
                    autoplay: true,
                    autoplayTimeout: 5000,
                    autoplayHoverPause: true
                });
        }
    }

    public imageZoom(coverImg: ProductPicture) {
        if (this.pictures.length > 0
            && coverImg.id
            && !this.isMobile()
            && $('.zoomContainer').length == 0
            && !this.zoomChecked
        ){                
            this.zoomChecked = true;
            $("#product-image-zoom").elevateZoom({
                zoomType: "inner",
                gallery: 'image-thumb',
                cursor: 'pointer',
                galleryActiveClass: 'active',
                imageCrossfade: true,
                responsive: true,
            });

        }
    }

    public resetGallery(): Promise<boolean>{
        return new Promise((resolve, reject) =>{
            
            if(this.coverImg)
                $('.zoomWindowContainer div').css('background-image', 'url(' + this.mediaPath + this.coverImg.full + ')');
            else
                $('.zoomWindowContainer div').remove();

            let $owl = $('#image-thumb');
            $owl.owlCarousel();
            $owl.trigger('destroy.owl.carousel')

            $owl = $('.image-group');
            $owl.owlCarousel();
            $owl.trigger('destroy.owl.carousel')

            this.zoomChecked = false;
            resolve(this.zoomChecked);
        });
    }

    public destroyZoom(){
        $('.image').prepend($('#product-image-zoom'));
        $('#product-image-zoom').removeData('elevateZoom');
        $('.zoomWrapper #product-image-zoom').unwrap();
        $('.zoomContainer').remove();

        let $owl = $('#image-thumb');
            $owl.owlCarousel();
            $owl.trigger('destroy.owl.carousel');
    }

    public isMobile(): boolean{
        return AppSettings.isMobile();
    }
}