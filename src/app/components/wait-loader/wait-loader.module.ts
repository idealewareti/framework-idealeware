import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaitLoaderComponent } from "app/components/wait-loader/wait-loader.component";

@NgModule({
    declarations: [ WaitLoaderComponent ],
    imports: [ CommonModule ],
    exports: [ WaitLoaderComponent ],
    providers: [],
})
export class WaitLoaderModule {}