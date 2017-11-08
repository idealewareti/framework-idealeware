import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandNavComponent } from './brand-nav.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [ BrandNavComponent ],
    imports: [ CommonModule, RouterModule ],
    exports: [ BrandNavComponent ],
    providers: [],
})
export class BrandNavModule {}