export class VariationOption{
    /**
     * Id da Opção da Variação
     * 
     * @type {string}
     * @memberof VariationOption
     */
    id: string;
    name: string;
    picture: string;
    quantity: number = 0;

    constructor(option = null){
        if(option) return this.createFromResponse(option);
    }

    public createFromResponse(response) : VariationOption{
        let model = new VariationOption();

        for(var k in response){
            model[k] = response[k];
        }

        return model;
    }
}