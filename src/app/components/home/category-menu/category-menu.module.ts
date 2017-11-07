import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryMenuComponent } from './category-menu.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [ CategoryMenuComponent ],
    imports: [ CommonModule, RouterModule ],
    exports: [ CategoryMenuComponent ],
    providers: [],
})
export class CategoryMenuModule {}