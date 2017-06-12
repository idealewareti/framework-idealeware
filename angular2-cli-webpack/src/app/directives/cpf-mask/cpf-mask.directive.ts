import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[cpfMask]',
})
export class CpfMaskDirective {

  constructor(private el: ElementRef) {}

  @HostListener('keyup', ['$event']) inputChanged(event) {
    let cpf = event.target.value;
    if (cpf) {
      cpf = cpf.replace(/\D/g, '');
    }

    if(cpf.length >=4 && cpf.length <= 6){
      cpf = cpf.replace(/^(\d{0,3})(\d+)/, '$1.$2')
    }

    else if(cpf.length > 6 && cpf.length <= 9){
      cpf = cpf.replace(/^(\d{0,3})(\d{0,3})(\d+)/, '$1.$2.$3')
    }

    else if(cpf.length > 9){
      cpf = cpf.replace(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d+)/, '$1.$2.$3-$4')
    }

    event.target.value = cpf;


  }

}