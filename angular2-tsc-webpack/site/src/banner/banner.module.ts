import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BannerComponent }  from './banner.component';

@NgModule({
    declarations: [ BannerComponent ],
    imports: [ BrowserModule ],
    exports: [ BannerComponent ]
})
export class BannerModule {}