import { NgModule } from '@angular/core';
import { CustomPaintComponent }  from './custom-paint.component';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { CustomPaintRoutingModule } from './custom-paint.router';
import { CustomPaintManufacturerModule } from './manufacturer/custom-paint-manufacturer.module';
import { CustomPaintColorModule } from './color/custom-paint-color.module';
import { CustomPaintVariationModule } from './variations/custom-paint-variation.module';
import { CustomPaintBaseModule } from './base/custom-paint-base.module';
import { CustomPaintService } from '../../services/custom-paint.service';

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