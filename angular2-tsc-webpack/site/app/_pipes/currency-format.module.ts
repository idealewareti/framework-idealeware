import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CurrencyFormatPipe }  from './currency-format.pipe';

@NgModule({
    declarations: [ CurrencyFormatPipe ],
    imports: [ BrowserModule ],
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