export class PagseguroOption{
    code: number;
    displayName: string;
    images: {}
    name: string;
    status: string;

    constructor(obj = null){
        if(obj) return this.createFromResponse(obj);
    }

    createFromResponse(response): PagseguroOption{
        let model = new PagseguroOption();

        for(let k in response){
            model[k] = response[k];
        }
        return model;
    }
}