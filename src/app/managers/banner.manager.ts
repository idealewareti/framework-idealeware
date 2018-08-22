import { Injectable } from "@angular/core";
import { BannerService } from "../services/banner.service";
import { Observable } from "rxjs";
import { Banner } from "../models/banner/banner";

@Injectable({
    providedIn: 'root'
})
export class BannerManager {

    constructor(private service: BannerService) { }

    public getBannersFromCategory(id, type): Observable<Banner[]> {
        return this.service.getBannersFromCategory(id, type);
    }

    public getBannersFromGroup(id, type): Observable<Banner[]> {
        return this.service.getBannersFromGroup(id, type);
    }

    public getBannersFromBrand(id, type): Observable<Banner[]> {
        return this.service.getBannersFromBrand(id, type);
    }
}