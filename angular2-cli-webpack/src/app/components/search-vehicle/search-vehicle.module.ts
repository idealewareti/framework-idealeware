import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SearchVehicleComponent } from "app/components/search-vehicle/search-vehicle.component";


@NgModule({
    declarations: [SearchVehicleComponent],
    imports: [BrowserModule, FormsModule, ReactiveFormsModule],
    providers: [],
    exports: [SearchVehicleComponent]
})
export class SearchVehicleModule {}