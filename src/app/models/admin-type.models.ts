import { IAdministrator } from "./administrator.model";

export interface IAdminType {
    idAdministratorType: number;
    description: string;
    photo: string;
    administratorTypeList?: IAdministrator[];
}