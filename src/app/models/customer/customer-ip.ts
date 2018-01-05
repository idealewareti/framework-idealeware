export class CustomerIp {
    addressFamily: string;
    scopeId: number;
    isIPv6Multicast: boolean;
    isIPv6LinkLocal: boolean;
    isIPv6SiteLocal: boolean;
    isIPv6Teredo: boolean;
    isIPv4MappedToIPv6: boolean;

    constructor(object = null) {
        if (object) return this.createFromResponse(object);
    }

    public createFromResponse(response): CustomerIp {
        let model = new CustomerIp();

        for (var k in response) {
            model[k] = response[k];
        }

        return model;

    }
}

