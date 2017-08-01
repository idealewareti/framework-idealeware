import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { CustomPaintManufacturerComponent }  from './custom-paint-manufacturer.component';
import { RouterModule } from "@angular/router";

@NgModule({
    declarations: [ CustomPaintManufacturerComponent ],
    imports: [ CommonModule, RouterModule ],
    providers: [],
    exports: [ CustomPaintManufacturerComponent ]
})
export class CustomPaintManufacturerModule {}