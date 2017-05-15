import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CartShowCaseComponent }  from './cart-showcase.component';

@NgModule({
    declarations: [ CartShowCaseComponent ],
    imports: [ BrowserModule ],
    providers: [],
    exports: [ CartShowCaseComponent ]
})
export class CartShowCaseModule {}