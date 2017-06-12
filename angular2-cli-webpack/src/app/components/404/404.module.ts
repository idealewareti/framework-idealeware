import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NotFoundComponent }  from './404.component';

@NgModule({
    declarations: [ NotFoundComponent ],
    imports: [ BrowserModule ],
    providers: [],
    bootstrap: [ NotFoundComponent ]
})
export class NotFoundModule {}