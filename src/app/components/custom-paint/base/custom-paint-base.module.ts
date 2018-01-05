import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { CustomPaintBaseComponent }  from './custom-paint-base.component';
import { RouterModule } from "@angular/router";
import { CurrencyFormatModule } from '../../../pipes/currency-format/currency-format.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [ CustomPaintBaseComponent ],
    imports: [ CommonModule, RouterModule, CurrencyFormatModule, FormsModule, ReactiveFormsModule ],
    providers: [],
    exports: [ CustomPaintBaseComponent ]
})
export class CustomPaintBaseModule {}