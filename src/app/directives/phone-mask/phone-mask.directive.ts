import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[phoneMask]',
})
export class PhoneMaskDirective {

  constructor(private el: ElementRef) { }

  @HostListener('keyup', ['$event']) inputChanged(event) {
    let phone = event.target.value;

    if (phone) {
      phone = phone.replace(/\D/g, '');
    }

    if (phone.length >= 4 && phone.length <= 6) {
      phone = phone.replace(/\D/g, '');
      phone = phone.replace(/^(\d{0,2})(.*)/, '($1) $2')
    }

    else if (phone.length > 6 && phone.length <= 10) {
      phone = phone.replace(/\D/g, '');
      phone = phone.replace(/^(\d{0,2})(\d{0,4})(.\d)/, '($1) $2-$3')
    }

    else if (phone.length > 10) {
      phone = phone.replace(/\D/g, '');
      phone = phone.replace(/^(\d{0,2})(\d{0,5})(.\d)/, '($1) $2-$3')
    }

    event.target.value = phone;
  }


  // onInputChange(event, backspace) {
  //   var newVal = event.replace(/\D/g, '');
  //   if (backspace) {
  //     newVal = newVal.substring(0, newVal.length - 1);
  //   } 

  //   if (newVal.length == 0) {
  //     newVal = '';
  //   } 
  //   else if (newVal.length <= 3) {
  //     newVal = newVal.replace(/^(\d{0,3})/, '($1)');
  //   } else if (newVal.length <= 6) {
  //     newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) ($2)');
  //   } else {
  //     newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) ($2)-$3');
  //   }
  //   this.model.valueAccessor.writeValue(newVal);       
  // }
}