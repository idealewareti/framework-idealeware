import { NgModule } from "@angular/core";
import { GroupComponent } from "./group.component";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
@NgModule({
    declarations: [GroupComponent],
    imports: [BrowserModule, RouterModule],
    providers:[],
    exports: [GroupComponent]
})
export class GroupModule {}