import { NgModule } from "@angular/core";
import { PopUpComponent } from "./popup.component";
import { CommonModule } from "@angular/common";
import { PopUpNewsLetterModule } from "../popup-newsletter/popup-newsletter.module";

@NgModule({
    declarations: [ PopUpComponent ],
    imports: [CommonModule, PopUpNewsLetterModule],
    providers: [],
    exports: [ PopUpComponent ]
})
export class PopUpModule {}