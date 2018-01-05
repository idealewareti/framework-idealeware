export class CustomerAddress {
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

    constructor(object = null) {
        if (object)
            return this.CreateFromResponse(object);
        else {
            this.id = null;
            this.mainAddress = false;
            this.addressType = null;
            this.zipCode = null;
            this.addressLine1 = null;
            this.addressLine2 = null;
            this.landmark = null;
            this.district = null;
            this.city = null;
            this.state = null;
            this.country = null;
            this.number = null;
            this.addressName = null;
        }
    }

    public CreateFromResponse(object): CustomerAddress {
        let address = new CustomerAddress();

        for (var k in object) {
            address[k] = object[k];
        }

        return address;
    }
}