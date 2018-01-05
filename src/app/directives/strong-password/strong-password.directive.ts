import { Directive, OnChanges, SimpleChange, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidatorFn, Validators } from "@angular/forms";

@Directive({
    selector: 'strongPassword',
    providers: [{ provide: NG_VALIDATORS, useExisting: StrongPasswordDirective, multi: true }]
})
export class StrongPasswordDirective {
    @Input() password: string;
    private valFn = Validators.nullValidator;

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        const change = changes['forbiddenName'];
        if (change) {
            const val: string | RegExp = change.currentValue;
            const re = /(?=.*\d)(?=.*[a-z]).{6,}/;
            this.valFn = strongPasswordValidator(re);
        }
        else {
            this.valFn = Validators.nullValidator;
        }
    }

    validate(control: AbstractControl): { [key: string]: any } {
        return this.valFn(control);
    }
}

export function strongPasswordValidator(passwordRegex: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const password = control.value;
        const no = passwordRegex.test(password);
        return !no ? { 'strongPassword': { password } } : null;
    };
}