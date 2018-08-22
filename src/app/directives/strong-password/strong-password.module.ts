import { NgModule } from '@angular/core';
import { StrongPasswordDirective }  from './strong-password.directive';

@NgModule({
    declarations: [ StrongPasswordDirective ],
    exports: [ StrongPasswordDirective ]
})
export class StrongPasswordModule {}