import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserEditComponent }  from './user-edit.component';
import { CpfMaskModule } from '../../_directives/cpf-mask/cpf-mask.module';
import { CnpjMaskModule } from '../../_directives/cnpj-mask/cnpj-mask.module';
import { PhoneMaskModule } from '../../_directives/phone-mask/phone-mask.module';

@NgModule({ 
    declarations: [ UserEditComponent ],
     imports: [ 
        BrowserModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        CpfMaskModule,
        CnpjMaskModule,
        PhoneMaskModule
    ],
    exports: [ UserEditComponent ]
})
export class UserEditModule
 {}