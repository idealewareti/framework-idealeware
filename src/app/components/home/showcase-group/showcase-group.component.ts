import { Component, OnInit } from '@angular/core';
import { PLATFORM_ID, Inject, Input } from '@angular/core';
import { Store } from '../../../models/store/store';
import { ShowcaseGroup } from '../../../models/showcase/showcase-group';
import { CarouselService } from '../../../services/carousel.service';

declare var $: any;

@Component({
    selector: 'app-showcase-group',
    templateUrl: '../../../template/home/showcase-group/showcase-group.html',
    styleUrls: ['../../../template/home/showcase-group/showcase-group.scss'],

})
export class ShowcaseGroupComponent implements OnInit /*implements AfterViewChecked*/ {
    @Input() store: Store;

    groups: ShowcaseGroup[];

    constructor(
        private carouselService: CarouselService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        this.carouselService.getCarousels()
            .subscribe(carousel => {
                this.groups = carousel;
            }, error => {
                console.log(`Problemas de conexão ao buscar grupos. :${error}`);
            })
    }
}