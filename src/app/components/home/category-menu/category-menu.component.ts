import { Component, OnInit, Input } from '@angular/core';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { Category } from '../../../models/category/category';
import { Globals } from '../../../models/globals';
import { CategoryService } from '../../../services/category.service';
import { Store } from '../../../models/store/store';
import { StoreService } from '../../../services/store.service';
import { AppCore } from '../../../app.core';

const CATEGORIES_TREE_KEY = makeStateKey('categories_tree');

@Component({
    selector: 'app-category-menu',
    templateUrl: '../../../template/home/category-menu/category-menu.html',
    styleUrls: ['../../../template/home/category-menu/category-menu.scss']
})
export class CategoryMenuComponent implements OnInit {
    @Input() isLoggedIn: boolean = false;
    @Input() store: Store;
    categories: Category[] = [];
    mediaPath: string;

    constructor(
        private service: CategoryService,
        private storeService: StoreService,
        private state: TransferState
    ) { }

    ngOnInit() {
        this.categories = this.state.get(CATEGORIES_TREE_KEY, null as any);
        if (!this.categories) {
            this.service.getTree()
                .subscribe(categories => {
                    this.categories = categories;
                    this.state.set(CATEGORIES_TREE_KEY, categories as any);
                }, error => {
                    console.log(error);
                });
        }
    }

    getMediaPath(): string {
        return `${this.store.link}/static/categories/`;
    }

    getRoute(category: Category): string {
        return `/categoria/${category.id}/${AppCore.getNiceName(category.name)}`;
    }
}