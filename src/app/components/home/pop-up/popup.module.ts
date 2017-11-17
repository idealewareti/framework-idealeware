import { NgModule } from "@angular/core";
import { PopUpComponent } from "./popup.component";
import { NewsLetterModule } from "../newsletter/newsletter.module";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [ PopUpComponent ],
    imports: [CommonModule, NewsLetterModule],
    providers: [],
    exports: [ PopUpComponent ]
})
export class PopUpModule {}