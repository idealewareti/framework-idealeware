import { NgModule } from '@angular/core';
import { ZipCodeMaskDirective }  from './zipcode-mask.directive';

@NgModule({
    declarations: [ ZipCodeMaskDirective ],
    exports: [ ZipCodeMaskDirective ]
})
export class ZipCodeMaskModule {}