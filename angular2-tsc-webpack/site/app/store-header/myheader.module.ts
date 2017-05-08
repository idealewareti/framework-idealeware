import {NgModule} from '@angular/core';
import {MyHeaderComponent} from './myheader.component';
import {CategoryNavModule} from '../category_nav/category_nav.module'
import {MiniCartModule} from '../cart-mini/mini-cart.module';
import {BrowserModule} from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SearchFormModule } from "../search-form/search-form.module";
import { SearchVehicleModule } from "../vehicle/searchVehicle.module";

@NgModule({
    imports: [CategoryNavModule, RouterModule, MiniCartModule, BrowserModule, SearchFormModule, SearchVehicleModule],
    declarations: [MyHeaderComponent],
    exports: [MyHeaderComponent],
})
export class MyHeaderModule {}