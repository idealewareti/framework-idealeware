import { NgModule } from "../../../../../node_modules/@angular/core";
import { CommonModule } from "../../../../../node_modules/@angular/common";

import { BudgetFinishComponent } from "./budget-finish.component";
import { RouterModule } from "../../../../../node_modules/@angular/router";

@NgModule({
    declarations:[BudgetFinishComponent],
    imports:[
        CommonModule,
        RouterModule
    ],
    exports:[BudgetFinishComponent]
})
export class BudgetFinishModule{}