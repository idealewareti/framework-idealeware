export class CreditCard{
    
  creditCardNumber: string;
  holderName: string;
  securityCode: string;
  expMonth: number;
  expYear: number;
  creditCardBrand: string;
  installmentCount: number;
  installmentValue: number;
  noInterestInstallmentQuantity: number;
  taxId: string;
  birthDate: Date;
  phone: string;

  isCardOK(taxIdValidate: boolean = false): boolean{
      if(!this.creditCardBrand)
          return false;
      else if(!this.creditCardNumber)
          return false;
      else if(!this.expMonth)
          return false;
      else if(!this.expYear)
          return false;
      else if(!this.holderName)
          return false;
      else if(!this.installmentCount)
          return false;
      else if(!this.installmentValue)
          return false;
      else if(!this.securityCode)
          return false;
      else if(taxIdValidate && !this.taxId)
          return false;
      else
          return true;
  }
}



