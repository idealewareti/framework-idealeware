import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {BrandNavComponent} from './brand-nav.component';

@NgModule({
    imports: [BrowserModule, RouterModule],
    declarations: [BrandNavComponent],
    exports: [BrandNavComponent]
})
export class BrandNavModule {}