export class BudgetCustomer {
    id: string;
    firstname_Companyname: string;
    lastname_Tradingname: string;
    cpf_Cnpj: string;
    phone: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    landmark: string;
    district: string;
    city: string;
    state: string;
    zipCode: string;
    deliveryZipCode: string;
    deliveryAddressLine1: string;
    deliveryAddressLine2: string;
    deliveryLandmark: string;
    deliveryDistrict: string;
    deliveryCity: string;
    deliveryState: string;

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    createFromResponse(object): BudgetCustomer {
        let model = new BudgetCustomer();

        for (var k in object) {
            model[k] = object[k];
        }

        return model;
    }

}