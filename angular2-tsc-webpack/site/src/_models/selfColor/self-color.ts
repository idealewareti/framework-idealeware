export class SelfColor{
    code: string;
    name: string;
    hex: string;

    constructor(code: string = null, name: string = null, hex: string = '#FFFFFF'){
        this.code = code;
        this.name = name;
        this.hex = hex;
    }
}