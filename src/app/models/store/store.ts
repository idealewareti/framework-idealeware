import { EnumStoreModality } from "../../enums/store-modality.enum";
import { StoreSetting } from "./store-setting";

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
    settings: StoreSetting[];
    imageFivIcon: string[];
    kondutoPublicKey: string;
}