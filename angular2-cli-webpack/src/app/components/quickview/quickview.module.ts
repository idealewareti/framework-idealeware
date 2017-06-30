import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { QuickViewComponent } from './quickview.component';
import { CurrencyFormatModule } from "app/pipes/currency-format/currency-format.module";

@NgModule({
    declarations: [ QuickViewComponent ],
    imports: [ BrowserModule, RouterModule, CurrencyFormatModule ],
    providers: [],
    exports: [ QuickViewComponent ]
})
export class QuickViewModule {}