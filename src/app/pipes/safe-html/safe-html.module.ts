import { NgModule } from "@angular/core";
import { SafeHtmlPipe } from "./safe-html.pipe";

@NgModule({
    declarations: [ SafeHtmlPipe ],
    exports: [ SafeHtmlPipe ]
})
export class SafeHtmlModule {
    static forRoot() {
      return {
          ngModule: SafeHtmlModule,
          providers: [],
      };
   }
}