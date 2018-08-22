import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaitLoaderComponent } from './wait-loader.component';

@NgModule({
    declarations: [ WaitLoaderComponent ],
    imports: [ CommonModule ],
    exports: [ WaitLoaderComponent ]
})
export class WaitLoaderModule {}