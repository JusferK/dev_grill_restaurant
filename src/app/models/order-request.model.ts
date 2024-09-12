import { IMenuOrderList } from "./menu-order-list.model";

export interface IOrderRequest {
    idOrderRequest: number;
    orderDateTime: Date;
    totalDue: number;
    status: string;
    lastStatusUpdate: Date;
    userEmail: string;
    menuOrderList: IMenuOrderList[]
}