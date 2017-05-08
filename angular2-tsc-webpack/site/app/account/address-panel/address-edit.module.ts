import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewAddressComponent }  from './address-edit.component';
 import { ZipCodeMaskModule } from '../../_directives/zipcode-mask/zipcode-mask.module'

@NgModule({ 
    declarations: [ NewAddressComponent ],
    imports: [ 
        BrowserModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        ZipCodeMaskModule,
    ],
    exports: [ NewAddressComponent ]
})
export class NewAddressModule {}