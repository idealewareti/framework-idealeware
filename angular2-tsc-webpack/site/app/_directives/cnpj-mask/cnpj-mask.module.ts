import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CnpjMaskDirective }  from './cnpj-mask.directive';

@NgModule({
    declarations: [ CnpjMaskDirective ],
    imports: [ BrowserModule ],
    providers: [],
    exports: [ CnpjMaskDirective ]
})
export class CnpjMaskModule {}