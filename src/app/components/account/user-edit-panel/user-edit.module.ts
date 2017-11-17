import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserEditComponent }  from './user-edit.component';
import { CpfMaskModule } from '../../../directives/cpf-mask/cpf-mask.module';
import { CnpjMaskModule } from '../../../directives/cnpj-mask/cnpj-mask.module';
import { PhoneMaskModule } from '../../../directives/phone-mask/phone-mask.module';
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [ UserEditComponent ],
     imports: [ 
        CommonModule,
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