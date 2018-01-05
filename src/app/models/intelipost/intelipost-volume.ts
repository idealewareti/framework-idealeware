export class IntelipostVolume {
    width: number;
    height: number;
    length: number;
    weight: number;
    costOfGoods: number;
    description: string;

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    public createFromResponse(response): IntelipostVolume {
        let model = new IntelipostVolume();

        for (var k in response) {
            model[k] = response[k];
        }

        return model;
    }
}