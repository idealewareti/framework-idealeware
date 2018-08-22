import { OrderStatusEnum } from "../../enums/order-status.enum";

export class HistoryStatus {
    status: OrderStatusEnum;
    alterDate: Date;
    description: string;
    statusName: string;
}