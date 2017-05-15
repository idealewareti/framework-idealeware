import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SearchVehicleComponent } from "./searchVehicle.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


@NgModule({
    declarations: [SearchVehicleComponent],
    imports: [BrowserModule, FormsModule, ReactiveFormsModule],
    providers: [],
    exports: [SearchVehicleComponent]
})
export class SearchVehicleModule {}