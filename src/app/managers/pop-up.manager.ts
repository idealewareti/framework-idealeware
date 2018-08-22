import { Injectable } from "@angular/core";
import { PopUpService } from "../services/pop-up.service";
import { Observable } from "rxjs";
import { PopUp } from "../models/popup/popup";

@Injectable({
    providedIn: 'root'
})
export class PopUpManager {

    constructor(private service: PopUpService) { }

    getPopUp(): Observable<PopUp> {
        return this.service.getPopUp();
    }
}