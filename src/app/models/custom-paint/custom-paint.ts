export class Paint {
    id: string;
    baseName: string;
    colorCode: string;
    variationName: string;
    colorName: string;
    colorRgb: string;
    dateAddCart: string;
    manufacturer: string;
    mD5: string;
    optionCode: string;
    optionHeight: number;
    optionId: string;
    optionLength: number;
    optionName: string;
    optionPicture: string;
    optionStatus: boolean;
    quantity: number;
    totalUnitPrice: number;
    totalDiscountPrice: number;
    totalPrice: number;

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    public createFromResponse(response): Paint {
        let model = new Paint();

        for (var k in response) {
            model[k] = response[k];
        }

        return model;
    }
}