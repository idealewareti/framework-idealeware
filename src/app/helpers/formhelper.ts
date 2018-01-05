import { Injectable } from '@angular/core'
import { FormGroup, AbstractControl } from '@angular/forms';

@Injectable()
export class FormHelper {
    public updateForm(form: FormGroup, values: any) {
        for (var controlName in form.controls) {
            if (values.hasOwnProperty(controlName)) {
                (<AbstractControl>form.controls[controlName]).updateValueAndValidity(values[controlName]);
            }
            else {
                (<AbstractControl>form.controls[controlName]).updateValueAndValidity(null);
            }
        }
    }

    public markFormAsUntouched(form: FormGroup) {
        form['_touched'] = false;
        form['_pristine'] = true;
        for (var i in form.controls) {
            (<any>form.controls[i])._touched = false;
            (<any>form.controls[i])._pristine = true;
        }
    }
}