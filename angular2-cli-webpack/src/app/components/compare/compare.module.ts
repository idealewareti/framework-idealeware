import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CompareComponent } from './compare.component';
import { CurrencyFormatPipe } from "app/pipes/currency-format.pipe";

@NgModule({
    declarations: [ CompareComponent ],
    imports: [ BrowserModule, CurrencyFormatPipe ],
    providers: [],
    exports: [ CompareComponent ]
})
export class CompareModule {}