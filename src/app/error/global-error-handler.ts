import { Injectable, ErrorHandler, Injector, InjectionToken } from "@angular/core";
import { Router } from '@angular/router';
import { NotFoundService } from "../services/not-found.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

	constructor(
		private injector: Injector,
		private notFoundService: NotFoundService
	) { }

	handleError(err: any): void {
		var router = this.injector.get(Router);
		var error = err.rejection || err

		console.log('error: ', error);

		if (error.status) {
			if (error.status >= 400 && error.status < 500)
 				if (this.notFoundService.isNotFound(router.url))
	 					router.navigateByUrl('not-found');
		}
	}
}