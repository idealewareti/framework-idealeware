import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BudgetComponent }  from './budget.component';

@NgModule({
    declarations: [ BudgetComponent ],
    imports: [ BrowserModule ],
    providers: [],
    exports: [ BudgetComponent ]
})
export class BudgetModule {}