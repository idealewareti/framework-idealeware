import {Component, Input, OnInit} from '@angular/core';
import {Category} from 'app/models/category/category';
import {CategoryService} from 'app/services/category.service';

@Component({
    moduleId: module.id,
    selector: 'bread-crump',
    templateUrl: '../../views/breadcrump.component.html'
})
export class BreadcrumpComponent implements OnInit {

    @Input() category: Category;
    
    crumps: Category[] = [];

    constructor(private service: CategoryService) {}

    ngOnInit() {
        if(this.category.isSet()){
            this.crumps.push(this.category);
            if(this.category['parentCategoryId'] && this.category.parentCategoryId != '00000000-0000-0000-0000-000000000000'){
                this.getParent(this.category.parentCategoryId);
            }
        }
    }

    getParent(parentCategoryId: string){
        this.service.getCategory(parentCategoryId)
        .then(category => {
            this.crumps.push(category);
            if(category.parentCategoryId && category.parentCategoryId != '00000000-0000-0000-0000-000000000000')
                this.getParent(category.parentCategoryId);
            else{
                this.crumps = this.crumps.reverse();
            }
        }).catch(error => console.log(error));
    }
}