import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[creditCartMask]',
})
export class CreditCardMaskDirective {
    constructor(private el: ElementRef) {}

    @HostListener('keyup', ['$event']) inputChanged(event) {
        let creditCardNumber = event.target.value;
        if (creditCardNumber) {
            creditCardNumber = creditCardNumber.replace(/\D/g, '');
        }

        if(creditCardNumber.length > 4 && creditCardNumber < 8){
            creditCardNumber = creditCardNumber.replace(/^(\d{0,4})(\d+)/, '$1-$2')
        }

        else if(creditCardNumber.length > 8 && creditCardNumber < 12){
            creditCardNumber = creditCardNumber.replace(/^(\d{0,4})(\d{0,4})(\d+)/, '$1-$2-$3')
        }

        else if(creditCardNumber.length > 12 && creditCardNumber < 16){
            creditCardNumber = creditCardNumber.replace(/^(\d{0,4})(\d{0,4})(\d{0,4})(\d+)/, '$1-$2-$3-$4')
        }

        else if(creditCardNumber.length == 16){
            creditCardNumber = creditCardNumber.replace(/^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/, '$1-$2-$3-$4')
        }

        event.target.value = creditCardNumber;
    }
}