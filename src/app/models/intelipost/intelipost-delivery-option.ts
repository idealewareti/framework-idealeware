export class IntelipostDeliveryOption {
    delivery_method_id: number;
    delivery_estimate_business_days: number;
    provider_shipping_cost: number;
    final_shipping_cost: number;
    description: string;
    deliveryNote: string;
    delivery_method_type: string;
    delivery_method_name: string;
    logistic_provider_name: string;
    delivery_note: string;

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    public createFromResponse(response): IntelipostDeliveryOption {
        let model = new IntelipostDeliveryOption();

        for (var k in response) {
            model[k] = response[k];
        }

        return model;
    }
}