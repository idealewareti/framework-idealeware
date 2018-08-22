import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceComponent } from './service.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CurrencyFormatModule } from '../../../pipes/currency-format/currency-format.module';
import { ZipCodeMaskModule } from '../../../directives/zipcode-mask/zipcode-mask.module';

@NgModule({
    declarations: [ ServiceComponent ],
    imports: [ CommonModule, FormsModule, ReactiveFormsModule, CurrencyFormatModule, ZipCodeMaskModule ],
    exports: [ ServiceComponent ]
})
export class ServiceModule {}