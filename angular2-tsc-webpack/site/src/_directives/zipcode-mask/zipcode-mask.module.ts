import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ZipCodeMaskDirective }  from './zipcode-mask.directive';

@NgModule({
    declarations: [ ZipCodeMaskDirective ],
    imports: [ BrowserModule ],
    providers: [],
    exports: [ ZipCodeMaskDirective ]
})
export class ZipCodeMaskModule {}