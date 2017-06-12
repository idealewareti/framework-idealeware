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

    constructor(private service: CategoryService) {
        if(!this.category) this.category = new Category();
    }

    ngOnInit() {
        this.crumps.push(this.category);
        if(this.category.parentCategoryId){
            this.getParent(this.category.parentCategoryId);
        }

        
    }

    getParent(parentCategoryId: string){
        this.service.getCategory(parentCategoryId)
        .then(category => {
            this.crumps.push(category);
            if(category.parentCategoryId)
                this.getParent(category.parentCategoryId);
            else{
                this.crumps = this.crumps.reverse();
            }
        }).catch(error => console.log(error));
    }
}