import { NgModule } from '@angular/core';
import { InstallmentSimulationComponent } from './installment-simulation.component';
import { CurrencyFormatModule } from '../../../pipes/currency-format/currency-format.module';
import { WaitLoaderModule } from '../wait-loader/wait-loader.module';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [InstallmentSimulationComponent],
    imports: [CommonModule, CurrencyFormatModule, WaitLoaderModule],
    exports: [InstallmentSimulationComponent]
})
export class InstallmentSimulationModule { }