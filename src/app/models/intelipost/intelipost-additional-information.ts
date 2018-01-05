export class IntelipostAdditionalInformation {

    freeShipping: boolean;
    extraCostsAbsolute: number;
    extraCostsPercentage: number;
    leadTimeBussinessDays: number;
    deliveryMethodIds: number[] = [];
    taxID: string;
    clientType: string;
    salesChannel: string;

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    public createFromResponse(response): IntelipostAdditionalInformation {
        let model = new IntelipostAdditionalInformation();

        for (var k in response) {
            model[k] = response[k];
        }

        return model;
    }
}