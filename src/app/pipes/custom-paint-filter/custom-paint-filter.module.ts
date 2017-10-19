import { NgModule } from '@angular/core';
import { CustomPaintFilterPipe } from "./custom-paint-filter.pipe";

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