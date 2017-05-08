import { PagseguroOption } from "./pagseguro-option";

export class PagseguroMethod {
    name: string;
    code: number;
    options: PagseguroOption[] = [];
    label: string;

    constructor(response = null){
        if(response) return this.createFromResponse(response);
    }

    createFromResponse(response): PagseguroMethod{
        let model = new PagseguroMethod();

        for(let k in response){
            if(k == 'options' && response.options){
                for(let option in response.options){
                    if(response.options[option].status == 'AVAILABLE')
                        model.options.push(new PagseguroOption(response.options[option]));
                }
            }
            else{
                model[k] = response[k];
            }
        }

        if(model.code == 2 || model.code == 4)
            model.label = model.options[0].displayName;
        else if(model.code == 3)
            model.label = 'Débito Online';
        else if(model.code == 1)
            model.label = 'Cartão de Crédito';
        else if(model.code == 7)
            model.label = 'Depósito';

        return model;
    }
}