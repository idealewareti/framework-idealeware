import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchFormComponent }  from './search-form.component';
import { RouterModule } from "@angular/router";

@NgModule({
    declarations: [ SearchFormComponent ],
    imports: [ BrowserModule, FormsModule, ReactiveFormsModule, RouterModule ],
    exports: [ SearchFormComponent ]
})
export class SearchFormModule {}