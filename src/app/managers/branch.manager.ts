import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { BranchService } from "../services/branch.service";
import { Branch } from "../models/branch/branch";

@Injectable({
    providedIn: 'root'
})
export class BranchManager {
    constructor(
        private branchService: BranchService
    ) { }

    public getBranches(zipcode: string): Observable<Branch[]> {
        return this.branchService.getBranches(zipcode);
    }
}