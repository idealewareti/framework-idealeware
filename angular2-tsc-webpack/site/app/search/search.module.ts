import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SearchComponent } from './search.component';
import { RouterModule } from "@angular/router";
import { OrderByModule } from "../_pipes/orderBy.module";

@NgModule({
    declarations: [ SearchComponent ],
    imports: [ BrowserModule, RouterModule, OrderByModule ],
    providers: [],
    bootstrap: [ SearchComponent ]
})
export class SearchModule {}