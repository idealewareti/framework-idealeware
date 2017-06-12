import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {SelfColorComponent} from './self-color.component';

@NgModule({
    imports: [BrowserModule],
    declarations: [SelfColorComponent],
    exports: [SelfColorComponent]
})
export class SelfColorModule {}