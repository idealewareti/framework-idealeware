import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LogoutComponent }  from './logout.component';

@NgModule({
    declarations: [ LogoutComponent ],
    imports: [ BrowserModule ],
    providers: [],
    exports: [ LogoutComponent ]
})
export class LogoutModule {}