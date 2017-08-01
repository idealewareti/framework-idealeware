import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CreditCardMaskDirective }  from './creditcard-mask.directive';

@NgModule({
    declarations: [ CreditCardMaskDirective ],
    imports: [ BrowserModule ],
    providers: [],
    exports: [ CreditCardMaskDirective ]
})
export class CreditCartdMaskModule {}