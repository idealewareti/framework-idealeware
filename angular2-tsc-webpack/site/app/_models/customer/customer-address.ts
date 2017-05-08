export class CustomerAddress{
    id: string;
    mainAddress: boolean;
    addressType: number;
    zipCode: string;
    addressLine1: string;
    addressLine2: string;
    landmark: string;
    district: string;
    city: string;
    state: string;
    country: string;
    number: string;
    addressName: string;

    constructor(object = null){
        if(object)
            return this.CreateFromResponse(object);
    }

    public CreateFromResponse(object) : CustomerAddress{
        let address = new CustomerAddress();

        for (var k in object){
            address[k] = object[k];
        }

        return address;
    }
}