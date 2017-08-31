import { StoreSetting } from "./storeSetting";
import { EnumStoreModality } from "app/enums/store-modality.enum";

export class Store {
    domain: string;
    link: string;
    logo: string;
    companyName: string;
    tradingName: string;
    cnpj: string;
    stateRegistration: string;
    responsible: string;
    phone: string;
    cellPhone: string;
    email: string;
    zipCode: string;
    addressLine1: string;
    addressLine2: string;
    district: string;
    city: string;
    state: string;
    country: string;
    modality: EnumStoreModality;
    settings: StoreSetting[] = [];

    public constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    public createFromResponse(response): Store {
        let model = new Store();

        for (var k in response) {

            if (k == 'settings') {
                model.settings = response.settings.map(o => o = new StoreSetting(o))
            }
            else {
                model[k] = response[k];
            }
        }

        return model;
    }
}