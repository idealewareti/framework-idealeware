import { Injectable } from "@angular/core";
import { GoogleService } from "../services/google.service";
import { Observable } from "rxjs";
import { Google } from "../models/google/google";

@Injectable({
    providedIn: 'root'
})
export class GoogleManager {

    constructor(private service: GoogleService) { }

    getAll(): Observable<Google> {
        return this.service.getAll();
    }

}