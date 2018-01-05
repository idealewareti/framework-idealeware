import { Directive, SimpleChange } from '@angular/core';
import { ValidatorFn, AbstractControl, Validators } from "@angular/forms";

@Directive({
    selector: 'emailValid',
})
export class EmailValidatorDirective {
    private valFn = Validators.nullValidator;

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        const change = changes['forbiddenName'];
        if (change) {
            const val: string | RegExp = change.currentValue;
            this.valFn = validEmail();
        }
        else {
            this.valFn = Validators.nullValidator;
        }
    }

    validate(control: AbstractControl): { [key: string]: any } {
        return this.valFn(control);
    }
}

export function validEmail(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const email = control.value;
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const valid = regex.test(email);
        return !valid ? { 'invalidEmail': { email } } : null;
    };
}