import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CpfMaskDirective }  from './cpf-mask.directive';

@NgModule({
    declarations: [ CpfMaskDirective ],
    imports: [ BrowserModule ],
    providers: [],
    exports: [ CpfMaskDirective ]
})
export class CpfMaskModule {}