import { PopUpComponent } from "./popup.component";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NewsLetterModule } from "../newsletter/newsletter.module";

@NgModule({
    declarations: [ PopUpComponent ],
    imports: [BrowserModule, NewsLetterModule],
    providers: [],
    exports: [ PopUpComponent ]
})
export class PopUpModule {}