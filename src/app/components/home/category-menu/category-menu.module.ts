import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryMenuComponent } from './category-menu.component';
import { RouterModule } from '@angular/router';
import { GroupModule } from '../group/group.module';

@NgModule({
    declarations: [ CategoryMenuComponent ],
    imports: [ CommonModule, RouterModule, GroupModule ],
    exports: [ CategoryMenuComponent ],
    providers: [],
})
export class CategoryMenuModule {}