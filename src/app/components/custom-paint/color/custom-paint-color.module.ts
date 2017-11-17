import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { CustomPaintColorComponent }  from './custom-paint-color.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CustomPaintFilterModule } from '../../../pipes/custom-paint-filter/custom-paint-filter.module';

@NgModule({
    declarations: [ CustomPaintColorComponent ],
    imports: [ CommonModule, FormsModule, ReactiveFormsModule, CustomPaintFilterModule, RouterModule ],
    providers: [],
    exports: [ CustomPaintColorComponent ]
})
export class CustomPaintColorModule {}