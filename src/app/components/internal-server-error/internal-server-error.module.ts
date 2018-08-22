import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InternalServerErrorComponent } from "./internal-server-error.component";

@NgModule({
    declarations: [
        InternalServerErrorComponent
    ],
    imports: [
        RouterModule.forChild([
            { path: '', component: InternalServerErrorComponent },
        ]),
        CommonModule,
    ]
})
export class InternalServerErrorModule { }