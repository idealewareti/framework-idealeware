import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import { ShowcaseBannerComponent } from './showcase-banner.component';

@NgModule({
    imports: [ 
        RouterModule, 
        BrowserModule, 
        FormsModule, 
    ],
    declarations: [ShowcaseBannerComponent],
    exports: [ShowcaseBannerComponent]
})
export class ShowcaseBannerModule {}