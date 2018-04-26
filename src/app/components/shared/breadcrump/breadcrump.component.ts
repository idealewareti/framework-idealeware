import {Component, Input, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import {Category} from '../../../models/category/category';
import {CategoryService} from '../../../services/category.service';
import { AppCore } from '../../../app.core';

@Component({
    moduleId: module.id,
    selector: 'app-bread-crump',
    templateUrl: '../../../template/shared/breadcrump/breadcrump.html',
    styleUrls: ['../../../template/shared/breadcrump/breadcrump.scss']
})
export class BreadcrumpComponent implements OnInit {

    @Input() categorys: Category[];
    
    crumps: Category[] = [];

    constructor(
        private service: CategoryService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit() {
        this.categorys.forEach((category)=>{
            if(category && category.id){
                this.crumps.push(category);
                if(category['parentCategoryId'] && !AppCore.isGuidEmpty(category.parentCategoryId)){
                    this.getParent(category.parentCategoryId);
                }
            }
        });
    }

    getParent(parentCategoryId: string){
        this.service.getCategory(parentCategoryId)
        .subscribe(category => {
            this.crumps.push(category);
            if(category.parentCategoryId && !AppCore.isGuidEmpty(category.parentCategoryId))
                this.getParent(category.parentCategoryId);
            else{
                this.crumps = this.crumps.reverse();
            }
        }, error => console.log(error));
    }
}