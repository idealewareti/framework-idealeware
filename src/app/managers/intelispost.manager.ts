import { IntelipostService } from "../services/intelipost.service";
import { IntelipostRequest } from "../models/intelipost/intelipost-request";
import { Intelipost } from "../models/intelipost/intelipost";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class IntelispostManager {
    constructor(private intelipostService: IntelipostService) { }

    public getShipping(request: IntelipostRequest, cartId: string): Observable<Intelipost> {
        return this.intelipostService.getShipping(request, cartId);
    }
}