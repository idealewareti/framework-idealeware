import { NgModule } from '@angular/core';
import { CustomPaintComponent }  from './custom-paint.component';
import { CommonModule } from "@angular/common";
import { CustomPaintRoutingModule } from "app/components/custom-paint/custom-paint.router";
import { CustomPaintManufacturerModule } from "app/components/custom-paint/manufacturer/custom-paint-manufacturer.module";
import { CustomPaintService } from "app/services/custom-paint.service";
import { RouterModule } from "@angular/router";
import { CustomPaintColorModule } from "app/components/custom-paint/color/custom-paint-color.module";
import { CustomPaintVariationModule } from "app/components/custom-paint/variations/custom-paint-variation.module";
import { CustomPaintBaseModule } from "app/components/custom-paint/base/custom-paint-base.module";

@NgModule({
    declarations: [ CustomPaintComponent ],
    imports: [ 
        CommonModule, 
        RouterModule, 
        CustomPaintRoutingModule, 
        CustomPaintManufacturerModule, 
        CustomPaintColorModule,
        CustomPaintVariationModule ,
        CustomPaintBaseModule
    ],
    providers: [ CustomPaintService ],
    exports: [ CustomPaintComponent ]
})
export class CustomPaintModule {}