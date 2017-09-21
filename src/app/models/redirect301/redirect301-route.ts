export class Redirect301Route{
    redirectFrom: string;
    redirectTo: string;

    constructor(from: string = null, to: string = null){
        this.redirectFrom = from;
        this.redirectTo = to;
    }
}