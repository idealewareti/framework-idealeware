import { NgModule } from '@angular/core';
import { CpfMaskDirective }  from './cpf-mask.directive';

@NgModule({
    declarations: [ CpfMaskDirective ],
    exports: [ CpfMaskDirective ]
})
export class CpfMaskModule {}