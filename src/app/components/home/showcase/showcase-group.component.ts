import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Store } from '../../../models/store/store';
import { ShowcaseGroup } from '../../../models/showcase/showcase-group';
import { CarouselManager } from '../../../managers/carousel.manager';

declare var $: any;

@Component({
    selector: 'showcase-group',
    templateUrl: '../../../templates/home/showcase-group/showcase-group.html',
    styleUrls: ['../../../templates/home/showcase-group/showcase-group.scss']
})
export class ShowcaseGroupComponent implements OnInit {
    @Input() store: Store;
    groups: ShowcaseGroup[];

    constructor(
        private carouselManager: CarouselManager
    ) { }

    ngOnInit(): void {
        this.carouselManager.getCarousels()
            .subscribe(carousel => {
                this.groups = carousel;
            },error => {
                throw new Error(`${error.error} Status: ${error.status}`);
            });
    }

    trackById(index, item) {
        return item.id;
    }
}