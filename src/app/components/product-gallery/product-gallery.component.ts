import { Component, OnInit, Input, AfterViewInit,OnChanges, SimpleChange, OnDestroy,SimpleChanges } from '@angular/core';
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
export class ProductGalleryComponent implements OnInit, OnChanges {
    
    @Input() sku: Sku = null;
    coverImg: ProductPicture = null;
    pictures: ProductPicture[] = [];
    mediaPath: string;
    private zoomChecked = false;
    
    constructor(private globals: Globals) { }

    ngOnInit() {
        this.mediaPath = `${this.globals.store.link}/static/products/`;
        this.pictures = this.sku.pictures;
        this.setCoverImage((this.sku.pictures.length > 0) ? this.sku.pictures[0] : new ProductPicture());
    }

    ngAfterViewInit() {
        this.imageZoom(this.coverImg);
        this.buildGallery();
    }

    
    ngOnChanges(changes: SimpleChanges) {
        if(changes['sku'] && !changes.sku.firstChange){
            
            if(changes.sku.previousValue.id != changes.sku.currentValue.id){
                this.pictures = this.sku.pictures;
                this.setCoverImage((this.sku.pictures.length > 0) ? this.sku.pictures[0] : new ProductPicture());
            }
        }
    }
    
    ngAfterViewChecked() {
        
    }

    ngOnDestroy() {
        this.destroyZoom();
    }

    setCoverImage(image: ProductPicture, event = null){
        if(event)
            event.preventDefault();
        this.coverImg = image;
        this.imageZoom(image);
    }

    isMobile(): boolean{
        return AppSettings.isMobile();
    }

    imageZoom(coverImg: ProductPicture) {
        if ($ && $.fn.zoom && !this.isMobile()) {
            this.destroyZoom();
            $('.image').zoom({url: `${this.mediaPath}${coverImg.full}`});
        }
    }

    destroyZoom(){
        $('.image').trigger('zoom.destroy');
    }

    /* Gallery */
    buildGallery(){
        if(this.isMobile()){
            $('.image-group').slick({
                dots: true,
                infinite: true
            });
        }
        else{
            $('#image-thumb').slick({
                infinite: true,
                slidesToShow: 5,
                slidesToScroll: 3
            });

        }
    }

    
}