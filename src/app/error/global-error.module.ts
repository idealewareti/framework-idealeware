import { NgModule, ErrorHandler } from "@angular/core";
import { GlobalErrorHandler } from "./global-error-handler";

@NgModule({
	providers: [
		{ provide: ErrorHandler, useClass: GlobalErrorHandler }
	]
})
export class GlobalErrorModule { }
