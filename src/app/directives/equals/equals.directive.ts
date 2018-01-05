import { Directive, Input, SimpleChange } from '@angular/core';
import { AbstractControl, ValidatorFn, Validators, FormGroup } from "@angular/forms";

@Directive({
    selector: 'equalsTo',
})
export class EqualsDirective {
    @Input() field1: string;
    @Input() field2: string;

    private valFn = Validators.nullValidator;

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        const change = changes['equalsValidator'];
        if (change) {
            const val: string | RegExp = change.currentValue;
            this.valFn = equalsValidator(this.field1);
        }
        else {
            this.valFn = Validators.nullValidator;
        }
    }

    validate(control: AbstractControl): { [key: string]: any } {
        return this.valFn(control);
    }
}

export function equalsValidator(fieldMustBeEqual): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const field = control.value;
        const no = (field == fieldMustBeEqual);
        return no ? { 'equalsTo': { field } } : null;
    };
}

export function equalsControlValidator(key): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        let fieldMustBeEqual = '';
        if (control.root['controls'])
            fieldMustBeEqual = control.root['controls'][key].value;
        const field = control.value;
        const equals = (field === fieldMustBeEqual);
        return !equals ? { 'equalsTo': { field } } : null;
    };
}

