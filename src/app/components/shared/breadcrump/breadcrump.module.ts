import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BreadcrumpComponent} from './breadcrump.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [BreadcrumpComponent],
    exports: [BreadcrumpComponent],
    imports: [CommonModule, RouterModule]
})
export class BreadcrumpModule {}