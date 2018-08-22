import { NgModule } from '@angular/core';
import { EmailValidatorDirective }  from './email-validator.directive';

@NgModule({
    declarations: [ EmailValidatorDirective ],
    exports: [ EmailValidatorDirective ]
})
export class EmailValidatorModule {}