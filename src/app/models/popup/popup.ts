import { Coupon } from "../coupon/coupon";

export class PopUp {
    id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: true;
    expired: true;
    picture: string;
    registrationRequired: boolean;
    coupon: Coupon;
}