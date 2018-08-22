import { Injectable, ErrorHandler, Injector, InjectionToken } from "@angular/core";
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

	constructor(
		private injector: Injector
	) { }

	handleError(err: any): void {
		var router = this.injector.get(Router);
		var error = err.rejection || err

		console.log('error: ', error);

		if (error.status) {
			if (error.status >= 400 && error.status < 500)
				router.navigateByUrl('not-found');
			if (error.status >= 500 && error.status < 600)
				router.navigateByUrl('internal-server-error');
		}
	}
}