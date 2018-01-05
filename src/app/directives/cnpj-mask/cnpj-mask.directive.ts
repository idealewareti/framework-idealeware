import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[cnpjMask]',
})
export class CnpjMaskDirective {

    constructor(private el: ElementRef) { }

    @HostListener('keyup', ['$event']) inputChanged(event) {
        let cnpj = event.target.value;

        if (cnpj) {
            cnpj = cnpj.replace(/\D/g, '');
        }

        if (cnpj.length >= 3 && cnpj.length <= 5) {
            cnpj = cnpj.replace(/^(\d{0,2})(\d+)/, '$1.$2')
        }

        else if (cnpj.length > 5 && cnpj.length <= 8) {
            cnpj = cnpj.replace(/^(\d{0,2})(\d{0,3})(\d+)/, '$1.$2.$3')
        }

        else if (cnpj.length > 8 && cnpj.length <= 12) {
            cnpj = cnpj.replace(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d+)/, '$1.$2.$3/$4')
        }

        else if (cnpj.length > 12) {
            //00.000.000/0000-00
            cnpj = cnpj.replace(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d+)/, '$1.$2.$3/$4-$5')
        }

        event.target.value = cnpj;

    }

}