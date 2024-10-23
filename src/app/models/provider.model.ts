import { IPhone } from "./phone.model";

export interface IProvider {
    provider_id?: number;
    name: string;
    nit: number;
    added_date: Date;
    phone_list?: IPhone[];
}