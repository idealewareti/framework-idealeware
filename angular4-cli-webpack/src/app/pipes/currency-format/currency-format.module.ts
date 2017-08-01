import { NgModule } from '@angular/core';
import { CurrencyFormatPipe }  from './currency-format.pipe';

@NgModule({
    declarations: [ CurrencyFormatPipe ],
    imports: [ ],
    providers: [],
    exports: [ CurrencyFormatPipe ]
})
export class CurrencyFormatModule {
    static forRoot() {
      return {
          ngModule: CurrencyFormatModule,
          providers: [],
      };
   }
}