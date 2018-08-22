import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";

import { InstitutionalManager } from "../managers/institutional.manager";
import { Institutional } from "../models/institutional/institutional";

@Injectable({
	providedIn: 'root'
})
export class InstitutionalResolver implements Resolve<Observable<Institutional>> {

	constructor(private manager: InstitutionalManager) { }

	resolve(route: ActivatedRouteSnapshot): Observable<Institutional> {
		let id = route.params.id;
		if (id)
			id = id.substr(id.length - 36);

		if (id)
			return this.manager.getById(id);
		else
			return this.manager.getDefault();
	}
}

