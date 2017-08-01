import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StrongPasswordDirective }  from './strong-password.directive';

@NgModule({
    declarations: [ StrongPasswordDirective ],
    imports: [ BrowserModule ],
    providers: [],
    exports: [ StrongPasswordDirective ]
})
export class StrongPasswordModule {}