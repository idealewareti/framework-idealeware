import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[cpfMask]',
})
export class CpfMaskDirective {

  constructor(private el: ElementRef) { }

  @HostListener('keyup', ['$event']) inputChanged(event) {

    let taxId = event.target.value;
    if (event.target.dataset.type == '2')
      event.target.value = this.formatCPNJ(taxId);
    else
      event.target.value = this.formatCPF(taxId);
  }

  /**
   * Retorna o CPF no formato 000.000.000.-00
   * 
   * @param {string} cpf 
   * @returns {string} 
   * @memberof CpfMaskDirective
   */
  formatCPF(cpf: string): string {
    if (cpf) {
      cpf = cpf.replace(/\D/g, '');
    }

    if (cpf.length >= 4 && cpf.length <= 6) {
      cpf = cpf.replace(/^(\d{0,3})(\d+)/, '$1.$2')
    }

    else if (cpf.length > 6 && cpf.length <= 9) {
      cpf = cpf.replace(/^(\d{0,3})(\d{0,3})(\d+)/, '$1.$2.$3')
    }

    else if (cpf.length > 9) {
      cpf = cpf.replace(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d+)/, '$1.$2.$3-$4')
    }

    return cpf;
  }

  /**
   * Retorna o CNPJ no formato 00.000.000/0000-00
   * 
   * @param {string} cpnj 
   * @returns {string} 
   * @memberof CpfMaskDirective
   */
  formatCPNJ(cnpj: string): string {
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

    return cnpj;
  }

}