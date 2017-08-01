import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceComponent } from './service.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CurrencyFormatModule } from "app/pipes/currency-format/currency-format.module";
import { ZipCodeMaskModule } from "app/directives/zipcode-mask/zipcode-mask.module";

@NgModule({
    declarations: [ ServiceComponent ],
    imports: [ BrowserModule, FormsModule, ReactiveFormsModule, CurrencyFormatModule, ZipCodeMaskModule ],
    providers: [],
    exports: [ ServiceComponent ]
})
export class ServiceModule {}