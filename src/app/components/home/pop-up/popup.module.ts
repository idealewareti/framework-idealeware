import { NgModule } from "@angular/core";
import { PopUpComponent } from "./popup.component";
import { CommonModule } from "@angular/common";
import { PopUpNewsLetterModule } from "../popup-newsletter/popup-newsletter.module";
import { CookieService } from 'ngx-cookie-service';

@NgModule({
    declarations: [PopUpComponent],
    imports: [CommonModule, PopUpNewsLetterModule],
    providers: [CookieService],
    exports: [PopUpComponent]
})
export class PopUpModule { }