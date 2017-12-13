import { StoreSetting } from "./store-setting";
import { EnumStoreModality } from "../../enums/store-modality.enum";

export class Store {
    domain: string;
    link: string;
    logo: string;
    logoMobile: string;
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
    imageFivIcon: string[] = [];

    public constructor(object = null) {
        if (object) return this.createFromResponse(object);
        else{
            this.domain = null;
            this.link = null;
            this.logo = null;
            this.companyName = null;
            this.tradingName =  null;
            this.phone = null;
        }
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