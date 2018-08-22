import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginEmbedComponent }  from './login-embed.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [ LoginEmbedComponent ],
    imports: [ CommonModule, FormsModule, ReactiveFormsModule, ],
    exports: [ LoginEmbedComponent ]
})
export class LoginEmbedModule {}