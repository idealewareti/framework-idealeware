import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Group } from "../models/group/group";
import { GroupService } from "../services/group.service";

@Injectable({
    providedIn: 'root'
})
export class GroupManager {

    constructor(private service: GroupService) { }

    getAll(): Observable<Group[]> {
        return this.service.getAll();
    }

    getById(id): Observable<Group> {
        return this.service.getById(id);
    }
}