import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {BreadcrumpComponent} from './breadcrump.component';

@NgModule({
    declarations: [BreadcrumpComponent],
    exports: [BreadcrumpComponent],
    imports: [BrowserModule, RouterModule]
})
export class BreadcrumpModule {}