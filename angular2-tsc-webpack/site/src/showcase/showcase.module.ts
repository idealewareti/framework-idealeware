import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ShowCaseComponent} from './showcase.component';

@NgModule({
    imports: [BrowserModule, RouterModule, FormsModule],
    declarations: [ShowCaseComponent],
    exports: [ShowCaseComponent]
})
export class ShowCaseModule {}