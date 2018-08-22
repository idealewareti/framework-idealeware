import { NgModule } from '@angular/core';
import { PhoneMaskDirective }  from './phone-mask.directive';

@NgModule({
    declarations: [ PhoneMaskDirective ],
    exports: [ PhoneMaskDirective ]
})
export class PhoneMaskModule {}