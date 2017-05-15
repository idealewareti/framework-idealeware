import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoadingIndicatorComponent }  from './loading.component';

@NgModule({
    declarations: [ LoadingIndicatorComponent ],
    imports: [ BrowserModule ],
    providers: [],
    exports: [ LoadingIndicatorComponent ]
})
export class LoadingIndicatorModule {}