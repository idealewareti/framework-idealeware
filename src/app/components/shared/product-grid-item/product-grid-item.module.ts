import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGridItemComponent } from './product-grid-item.component';
import { RouterModule } from '@angular/router';
import { CurrencyFormatModule } from '../../../pipes/currency-format/currency-format.module';
import { InstallmentSimulationModule } from '../../product/installment-simulation/installment-simulation.module';

@NgModule({
    declarations: [ProductGridItemComponent],
    imports: [CommonModule, RouterModule, CurrencyFormatModule, InstallmentSimulationModule],
    exports: [ProductGridItemComponent],
    providers: [],
})
export class ProductGridItemModule { }