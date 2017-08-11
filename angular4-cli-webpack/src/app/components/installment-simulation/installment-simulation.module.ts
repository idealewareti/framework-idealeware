import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InstallmentSimulationComponent } from './installment-simulation.component';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CurrencyFormatModule } from "app/pipes/currency-format/currency-format.module";
import { WaitLoaderModule } from "app/components/wait-loader/wait-loader.module";

@NgModule({
    declarations: [ InstallmentSimulationComponent ],
    imports: [ BrowserModule, ReactiveFormsModule, FormsModule, CurrencyFormatModule, WaitLoaderModule ],
    providers: [],
    exports: [ InstallmentSimulationComponent ]
})
export class InstallmentSimulationModule {}