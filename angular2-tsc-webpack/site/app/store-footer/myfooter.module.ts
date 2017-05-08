import {NgModule} from '@angular/core';
import {MyFooterComponent} from './myfooter.component';
import {BrowserModule} from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NewsLetterModule } from "../newsletter/newsletter.module";
import { ZipCodeMaskModule } from "../_directives/zipcode-mask/zipcode-mask.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PopUpModule } from "../pop-up/popup.module";
import { SearchVehicleModule } from "../vehicle/searchVehicle.module";

@NgModule({
    imports: [RouterModule, BrowserModule, NewsLetterModule, ZipCodeMaskModule, FormsModule, ReactiveFormsModule, PopUpModule],
    declarations: [MyFooterComponent],
    exports: [MyFooterComponent]
})
export class MyFooterModule {}