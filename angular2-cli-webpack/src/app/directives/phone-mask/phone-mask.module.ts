import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PhoneMaskDirective }  from './phone-mask.directive';

@NgModule({
    declarations: [ PhoneMaskDirective ],
    imports: [ BrowserModule ],
    providers: [],
    exports: [ PhoneMaskDirective ]
})
export class PhoneMaskModule {}