export class SelfColor{
    code: string;
    name: string;
    hex: string;
    familyId: string;

    constructor(code: string = null, name: string = null, hex: string = '#FFFFFF', familyId: string = null){
        this.code = code;
        this.name = name;
        this.hex = hex;
        this.familyId = familyId;
    }
}
