import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EmailValidatorDirective }  from './email-validator.directive';

@NgModule({
    declarations: [ EmailValidatorDirective ],
    imports: [ BrowserModule ],
    providers: [],
    exports: [ EmailValidatorDirective ]
})
export class EmailValidatorModule {}