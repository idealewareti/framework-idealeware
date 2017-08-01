import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OrderByPipe }  from './orderBy.pipe';

@NgModule({
    declarations: [ OrderByPipe ],
    imports: [ BrowserModule ],
    providers: [],
    exports: [ OrderByPipe ]
})
export class OrderByModule {
    static forRoot() {
      return {
          ngModule: OrderByModule,
          providers: [],
      };
   }
}