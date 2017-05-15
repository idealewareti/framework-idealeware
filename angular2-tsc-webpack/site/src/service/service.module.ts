import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceComponent } from './service.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CurrencyFormatModule } from "../_pipes/currency-format.module";
import { ZipCodeMaskModule } from "../_directives/zipcode-mask/zipcode-mask.module";

@NgModule({
    declarations: [ ServiceComponent ],
    imports: [ BrowserModule, FormsModule, ReactiveFormsModule, CurrencyFormatModule, ZipCodeMaskModule ],
    providers: [],
    exports: [ ServiceComponent ]
})
export class ServiceModule {}