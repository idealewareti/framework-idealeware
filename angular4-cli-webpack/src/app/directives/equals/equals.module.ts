import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EqualsDirective }  from './equals.directive';

@NgModule({
    declarations: [ EqualsDirective ],
    imports: [ BrowserModule ],
    providers: [],
    exports: [ EqualsDirective ]
})
export class EqualsModule {}