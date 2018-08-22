import { Component, Input, OnChanges } from '@angular/core';
import { Category } from '../../../models/category/category';
import { AppCore } from '../../../app.core';
import { CategoryManager } from '../../../managers/category.manager';

@Component({
    selector: 'bread-crump',
    templateUrl: '../../../templates/shared/breadcrump/breadcrump.html',
    styleUrls: ['../../../templates/shared/breadcrump/breadcrump.scss']
})
export class BreadcrumpComponent implements OnChanges {

    @Input() categorys: Category[];

    crumps: Category[] = [];

    constructor(
        private categoryManager: CategoryManager,
    ) { }

    ngOnChanges() {
        this.crumps = [];
        this.categorys.forEach((category) => {
            if (category && category.id) {
                this.crumps.push(category);
                if (category['parentCategoryId'] && !AppCore.isGuidEmpty(category.parentCategoryId)) {
                    this.getParent(category.parentCategoryId);
                }
            }
        });
    }

    getParent(parentCategoryId: string) {
        this.categoryManager.getCategory(parentCategoryId)
            .subscribe(category => {
                this.crumps.push(category);
                if (category.parentCategoryId && !AppCore.isGuidEmpty(category.parentCategoryId))
                    this.getParent(category.parentCategoryId);
                else {
                    this.crumps = this.crumps.reverse();
                }
            });
    }

    getRouteCategory(crump: Category) {
        return `${AppCore.getNiceName(crump.name)}-${crump.id}`;
    }
}