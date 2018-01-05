import { NgModule }     from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomPaintManufacturerComponent } from './manufacturer/custom-paint-manufacturer.component';
import { CustomPaintColorComponent } from './color/custom-paint-color.component';
import { CustomPaintVariationComponent } from './variations/custom-paint-variation.component';
import { CustomPaintBaseComponent } from './base/custom-paint-base.component';
import { CustomPaintComponent } from './custom-paint.component';


const routes: Routes = [
  { path: '',
    component: CustomPaintComponent,
    children: [
      { path: '',    component: CustomPaintManufacturerComponent },
      { path: ':manufacturer', component: CustomPaintColorComponent },
      { path: ':manufacturer/:color', component: CustomPaintBaseComponent },
      { path: ':manufacturer/:color/:option', component: CustomPaintBaseComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomPaintRoutingModule {}