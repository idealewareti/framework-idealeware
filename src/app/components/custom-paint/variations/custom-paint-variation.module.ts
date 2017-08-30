import { NgModule } from '@angular/core';
import { CustomPaintVariationComponent }  from './custom-paint-variation.component';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@NgModule({
    declarations: [ CustomPaintVariationComponent ],
    imports: [ CommonModule, RouterModule ],
    providers: [],
    exports: [ CustomPaintVariationComponent ]
})
export class CustomPaintVariationModule {}