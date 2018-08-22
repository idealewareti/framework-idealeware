import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Redirect301Service } from "../services/redirect301.service";
import { Redirect301Route } from "../models/redirect301/redirect301-route";
import { RedirectFrom } from "../models/redirect301/redirectFrom";
import { RedirectTo } from "../models/redirect301/redirectTo";

@Injectable({
    providedIn: 'root'
})

export class Redirect301Manager{
    constructor(private service: Redirect301Service) { }

    getAll(): Observable<Redirect301Route[]> {
       return this.service.getAll();
    }

    getRedirectTo(redirectFrom: RedirectFrom): Observable<RedirectTo> {
      return this.service.getRedirectTo(redirectFrom);
    }
}