import { Directive, Input, SimpleChange } from '@angular/core';
import { AbstractControl, ValidatorFn, Validators } from "@angular/forms";

@Directive({
    selector: 'equalsTo',
})
export class EqualsDirective {
    @Input() field1: string;
    @Input() field2: string;
    
    private valFn = Validators.nullValidator;
    
    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        const change = changes['equalsValidator'];
        if (change) {
            const val: string | RegExp = change.currentValue;
            this.valFn = equalsValidator(this.field2);
        }
        else {
            this.valFn = Validators.nullValidator;
        }
    }

    validate(control: AbstractControl): {[key: string]: any} {
        return this.valFn(control);
    }
}

export function equalsValidator(fieldMustBeEqual: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
        const field = control.value;
        const no = (field == fieldMustBeEqual);
        return no ? {'equalsTo': {field}} : null;
    };
}