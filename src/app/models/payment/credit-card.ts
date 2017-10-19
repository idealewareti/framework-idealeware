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
  payment: string = null;
  totalPurchasePrice: number;

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
        if(this.payment == 'pagseguro' && !this.taxId)
            return false;
        if(this.payment == 'pagseguro' && !this.birthDate)
            return false;
        else
            return true;
  }
}



