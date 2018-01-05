export class IntelipostRequest {

    session: string;
    pageName: string;
    url: string;
    zipCode: string;

    constructor(
        session: string,
        pageName: string,
        url: string,
        zipCode: string
    ) {
        this.session = session;
        this.pageName = pageName;
        this.url = url;
        this.zipCode = zipCode;
    }
}