import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[zipcodeMask]',
})
export class ZipCodeMaskDirective {
    constructor(private el: ElementRef) { }

    @HostListener('keyup', ['$event']) inputChanged(event) {
        let zipcode = event.target.value;
        if (zipcode) {
            zipcode = zipcode.replace(/\D/g, '');
        }

        if (zipcode.length > 5) {
            zipcode = zipcode.replace(/^(\d{0,5})(\d+)/, '$1-$2')
        }

        event.target.value = zipcode;
    }
}