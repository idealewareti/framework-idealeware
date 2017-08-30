export class MercadoPagoIssuer {
    id: string;
    name: string;
    secure_thumbnail: string;
    thumbnail: string;

    constructor(object = null){
        if(object) return this.createResponse(object);
    }


   createResponse(object): MercadoPagoIssuer{
        let model = new MercadoPagoIssuer();

        for(let k in object){
            model[k] = object[k];
        }
        return model;
    }
}
