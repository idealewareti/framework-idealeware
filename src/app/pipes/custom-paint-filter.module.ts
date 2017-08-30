import { NgModule } from '@angular/core';
import { CustomPaintFilterPipe } from "app/pipes/custom-paint-filter.pipe";

@NgModule({
    declarations: [ CustomPaintFilterPipe ],
    imports: [],
    providers: [],
    exports: [ CustomPaintFilterPipe ]
})
export class CustomPaintFilterModule {
    static forRoot() {
      return {
          ngModule: CustomPaintFilterModule,
          providers: [],
      };
   }
}