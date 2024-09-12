import { IOrderRequest } from "./order-request.model";

export interface IUser {
    name: string;
    lastName: string;
    email: string;
    password?: string;
    nit: number;
    signDate: Date;
    orderRequestList?: IOrderRequest[]
}