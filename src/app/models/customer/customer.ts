import { CustomerAddress } from './customer-address';

export class Customer {
  id: string;
  code: string;
  rg_Ie: string;
  cpf_Cnpj: string;
  firstname_Companyname: string;
  lastname_Tradingname: string;
  email: string;
  password: string;
  phone: string;
  celPhone: string;
  receivenews: boolean;
  agree: boolean;
  gender: string;
  birthdate: Date;
  addresses: CustomerAddress[] = [];
  status: true;
  receivePromotionalAndNews: true;
  type: number = 1;

  constructor(object = null) {
    if (object) return this.createFromResponse(object);
  }

  public createFromResponse(response): Customer {
    let customer = new Customer();

    for (var k in response) {
      if (k == 'addresses') {
        customer.addresses = response.addresses.map(address => address = new CustomerAddress(address));
      }
      else {
        customer[k] = response[k];
      }
    }

    return customer;
  }

}