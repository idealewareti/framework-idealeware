import { IntelipostVolume } from "./intelipost-volume";
import { IntelipostDeliveryOption } from "./intelipost-delivery-option";
import { IntelipostAdditionalInformation } from "./intelipost-additional-information";
import { IntelipostIdentification } from "./intelipost-identification";

export class IntelipostContent {

    id: number;
    clientId: number;
    originZipCode: string;
    destinationZipCode: string;
    created: Date;
    volumes: IntelipostVolume[] = [];
    delivery_options: IntelipostDeliveryOption[] = [];
    additional_information: IntelipostAdditionalInformation;
    identification: IntelipostIdentification;

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    public createFromResponse(response): IntelipostContent {
        let model = new IntelipostContent();

        for (var k in response) {
            if (k == 'volumes') {
                model.volumes = response.volumes.map(obj => new IntelipostVolume(obj));
            }
            else if (k == 'delivery_options') {
                model.delivery_options = response.delivery_options.map(obj => new IntelipostDeliveryOption(obj));
            }
            else if (k == 'addtionalInformation') {
                model.additional_information = new IntelipostAdditionalInformation(response.additional_information);
            }
            else if (k == 'identification') {
                model.identification = new IntelipostIdentification(response.identification);
            }
            else {
                model[k] = response[k];
            }
        }

        return model;
    }

}