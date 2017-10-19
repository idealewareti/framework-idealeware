import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { CustomPaintColorComponent }  from './custom-paint-color.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CustomPaintFilterModule } from "app/pipes/custom-paint-filter/custom-paint-filter.module";
import { RouterModule } from "@angular/router";

@NgModule({
    declarations: [ CustomPaintColorComponent ],
    imports: [ CommonModule, FormsModule, ReactiveFormsModule, CustomPaintFilterModule, RouterModule ],
    providers: [],
    exports: [ CustomPaintColorComponent ]
})
export class CustomPaintColorModule {}