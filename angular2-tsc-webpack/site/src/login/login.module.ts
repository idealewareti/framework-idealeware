import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginComponent} from './login.component';

@NgModule({
    imports: [
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [LoginComponent],
    exports: [LoginComponent],
})
export class LoginModule {}