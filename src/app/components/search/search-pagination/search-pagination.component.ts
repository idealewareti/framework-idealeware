import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, PLATFORM_ID, Inject } from '@angular/core';
import { Pagination } from '../../../models/pagination';
import { ModelReference } from '../../../models/model-reference';
import { AppCore } from '../../../app.core';
import { isPlatformBrowser } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-search-pagination',
    templateUrl: '../../../template/search/search-pagination/search-pagination.html',
    styleUrls: ['../../../template/search/search-pagination/search-pagination.scss']
})
export class SearchPaginationComponent implements OnInit, OnChanges {
    @Input() page: number;
    @Input() pagination: Pagination;
    @Output() pageChanged: EventEmitter<Number> = new EventEmitter<Number>();

    numPages: number;
    initialPage: number = 1;
    lastPage: number = 1;
    pages: ModelReference[] = [];

    constructor( @Inject(PLATFORM_ID) private platformId: Object) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.createPages();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (isPlatformBrowser(this.platformId)) {
            this.numPages = this.pagination.TotalPages;

            this.createPages();
        }
    }


    navigate(page, event = null) {
        if (event)
            event.preventDefault();

        this.page = (Number.parseInt(page) > 0) ? Number.parseInt(page) : 1;
        this.createPages();
        this.pageChanged.emit(page);

    }


    createPages() {
        this.pages = [];
        if (this.numPages > 10) {

            this.initialPage = (this.page - 2 < 1) ? 1 : this.page - 2;
            this.lastPage = (this.page + 2 > this.numPages) ? this.numPages : this.page + 2;
            for (let i = this.initialPage; i <= this.lastPage; i++) {
                let page = new ModelReference({ 'id': i.toString(), 'name': i.toString() });
                this.pages.push(page);
            }

            if (this.pages.length > 2 && Number.parseInt(this.pages[0].id) > 3) {
                this.pages.unshift(new ModelReference({ 'id': '1', 'name': '1' }), new ModelReference({ 'id': '2', 'name': '2' }), new ModelReference({ 'id': this.pages[0].id, 'name': '...' }));
            }
            else if (this.pages.length > 2 && Number.parseInt(this.pages[0].id) <= 3) {
                for (let i = Number.parseInt(this.pages[0].id) - 1; i > 0; i--)
                    this.pages.unshift(new ModelReference({ 'id': i, 'name': i }));
            }

            if (Number.parseInt(this.pages[this.pages.length - 1].id) < this.numPages) {
                let last = this.numPages - 2;
                if (Number.parseInt(this.pages[this.pages.length - 1].id) < this.numPages - 3) {
                    this.pages.push(new ModelReference({ 'id': last, 'name': '...' }));
                }
                for (let i = last + 1; i <= this.numPages; i++)
                    this.pages.push(new ModelReference({ 'id': i, 'name': i }));
            }
        }
        else {
            for (let i = 1; i <= this.numPages; i++) {
                let page = new ModelReference({ 'id': i.toString(), 'name': i.toString() });
                this.pages.push(page);
            }
        }
    }

    isMobile(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return AppCore.isMobile(window);
        }
        else return false;
    }
}