import { NgModule } from "../../../../../node_modules/@angular/core";
import { BudgetComponent } from "./budget.component";
import { CommonModule } from "../../../../../node_modules/@angular/common";
import { CurrencyFormatModule } from "../../../pipes/currency-format/currency-format.module";
import { BudgetManager } from "../../../managers/budget.manager";

@NgModule({
    declarations: [BudgetComponent],
    imports: [
        CommonModule,
        CurrencyFormatModule
    ],
    exports: [BudgetComponent],
    providers: [BudgetManager]
})
export class BudgetModule { }