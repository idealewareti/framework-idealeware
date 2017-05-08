import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import { CategoryNavComponent } from './category_nav.component';
import { GroupModule } from "../group/group.module";

@NgModule({
    imports: [BrowserModule, RouterModule, GroupModule],
    declarations: [CategoryNavComponent],
    exports: [CategoryNavComponent],
})
export class CategoryNavModule {}