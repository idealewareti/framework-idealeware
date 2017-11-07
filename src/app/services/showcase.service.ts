import { Injectable } from "@angular/core";
import { HttpClientHelper } from "../helpers/http.helper";
import { environment } from "../../environments/environment";

@Injectable()
export class ShowcaseService{

    constructor(private client: HttpClientHelper) {}
}