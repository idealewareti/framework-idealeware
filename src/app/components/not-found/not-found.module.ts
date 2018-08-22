import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { NotFoundComponent } from "./not-found.component";
import { CommonModule } from "@angular/common";
import { Redirect301Resolver } from "../../resolvers/redirect301.resolver";

@NgModule({
    declarations: [
        NotFoundComponent
    ],
    imports: [
        RouterModule.forChild([
            {
                path: '', component: NotFoundComponent, resolve: {
                    redirect: Redirect301Resolver
                }
            },
        ]),
        CommonModule,
    ]
})
export class NotFoundModule { }