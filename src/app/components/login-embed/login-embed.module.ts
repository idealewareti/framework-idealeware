import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoginEmbedComponent }  from './login-embed.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [ LoginEmbedComponent ],
    imports: [ BrowserModule, FormsModule, ReactiveFormsModule, ],
    providers: [],
    exports: [ LoginEmbedComponent ]
})
export class LoginEmbedModule {}