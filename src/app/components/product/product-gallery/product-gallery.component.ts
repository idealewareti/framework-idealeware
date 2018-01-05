import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChange, OnDestroy, SimpleChanges, PLATFORM_ID, Inject } from '@angular/core';
import { ProductPicture } from "../../../models/product/product-picture";
import { Sku } from "../../../models/product/sku";
import { Globals } from "../../../models/globals";
import { isPlatformBrowser } from '@angular/common';
import { AppCore } from '../../../app.core';
import { Store } from '../../../models/store/store';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'app-product-gallery',
    templateUrl: '../../../template/product/product-gallery/product-gallery.html',
    styleUrls: ['../../../template/product/product-gallery/product-gallery.scss']
})
export class ProductGalleryComponent implements OnInit, OnChanges {

    @Input() sku: Sku = null;
    @Input() store: Store;
    coverImg: ProductPicture = null;
    pictures: ProductPicture[] = [];
    mediaPath: string;
    private zoomChecked = false;

    constructor( @Inject(PLATFORM_ID) private platformId: Object) { }

    ngOnInit() {
        this.pictures = this.sku.pictures;
        this.setCoverImage((this.sku.pictures.length > 0) ? this.sku.pictures[0] : new ProductPicture());
    }

    ngAfterViewInit() {
        this.imageZoom(this.coverImg);
        this.buildGallery();
    }


    ngOnChanges(changes: SimpleChanges) {
        if (changes['sku'] && !changes.sku.firstChange) {

            if (changes.sku.previousValue.id != changes.sku.currentValue.id) {
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

    setCoverImage(image: ProductPicture, event = null) {
        if (event)
            event.preventDefault();
        this.coverImg = image;
        this.imageZoom(image);
    }

    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;
    }

    imageZoom(coverImg: ProductPicture) {
        let imgFull = this.getFullPictureUrl(coverImg);
        if (isPlatformBrowser(this.platformId)) {
            if ($ && $.fn.zoom && !this.isMobile()) {
                this.destroyZoom();
                $('.image').zoom({ url: imgFull });
            }
        }
    }

    destroyZoom() {
        if (isPlatformBrowser(this.platformId)) {
            $('.image').trigger('zoom.destroy');
        }
    }

    /* Gallery */
    buildGallery() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.isMobile()) {
                $('.image-group').slick({
                    dots: true,
                    infinite: true
                });
            }
            else {
                $('#image-thumb').slick({
                    infinite: true,
                    slidesToShow: 5,
                    slidesToScroll: 3
                });

            }
        }
    }

    getPictureUrl(picture: ProductPicture): string {
        return `${this.store.link}/static/products/${picture.showcase}`;
    }

    getFullPictureUrl(picture: ProductPicture): string {
        return `${this.store.link}/static/products/${picture.full}`;
    }

    getThumbnailUrl(picture: ProductPicture): string {
        return `${this.store.link}/static/products/${picture.thumbnail}`;
    }
}