import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddressEditComponent } from './address-edit.component';
import { ZipCodeMaskModule } from '../../../directives/zipcode-mask/zipcode-mask.module'

@NgModule({
    declarations: [AddressEditComponent],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        ZipCodeMaskModule,
    ],
    exports: [AddressEditComponent]
})
export class AddressEditModule { }