import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SignUpComponent} from './signup.component';
import {PhoneMaskModule} from 'app/directives/phone-mask/phone-mask.module'
import {CpfMaskModule} from 'app/directives/cpf-mask/cpf-mask.module';
import {CnpjMaskModule} from 'app/directives/cnpj-mask/cnpj-mask.module';
 import {ZipCodeMaskModule} from 'app/directives/zipcode-mask/zipcode-mask.module'


@NgModule({
    imports: [
        RouterModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        PhoneMaskModule,
        CpfMaskModule,
        CnpjMaskModule,
        ZipCodeMaskModule
    ],
    declarations: [SignUpComponent],
    exports: [SignUpComponent]
})
export class SignUpModule {}