import { NgModule }     from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomPaintComponent } from "app/components/custom-paint/custom-paint.component";
import { CustomPaintManufacturerComponent } from "app/components/custom-paint/manufacturer/custom-paint-manufacturer.component";
import { CustomPaintColorComponent } from "app/components/custom-paint/color/custom-paint-color.component";
import { CustomPaintVariationComponent } from "app/components/custom-paint/variations/custom-paint-variation.component";
import { CustomPaintBaseComponent } from "app/components/custom-paint/base/custom-paint-base.component";


const routes: Routes = [
  { path: '',
    component: CustomPaintComponent,
    children: [
      { path: '',    component: CustomPaintManufacturerComponent },
      { path: ':manufacturer', component: CustomPaintColorComponent },
      { path: ':manufacturer/:color', component: CustomPaintVariationComponent },
      { path: ':manufacturer/:color/:option', component: CustomPaintBaseComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomPaintRoutingModule {}