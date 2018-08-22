import { NgModule } from '@angular/core';
import { CnpjMaskDirective }  from './cnpj-mask.directive';

@NgModule({
    declarations: [ CnpjMaskDirective ],
    exports: [ CnpjMaskDirective ]
})
export class CnpjMaskModule {}