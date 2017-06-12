import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InstallmentSimulationComponent } from './installment-simulation.component';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CurrencyFormatModule } from "app/pipes/currency-format.module";

@NgModule({
    declarations: [ InstallmentSimulationComponent ],
    imports: [ BrowserModule, ReactiveFormsModule, FormsModule, CurrencyFormatModule ],
    providers: [],
    exports: [ InstallmentSimulationComponent ]
})
export class InstallmentSimulationModule {}