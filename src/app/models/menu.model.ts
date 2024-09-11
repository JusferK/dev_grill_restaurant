import { IMenuIngredientList } from "./ingredient.model";

export interface IMenu {
    idMenu?: number;
    price: number;
    name: string;
    description: string;
    photo: string;
    isAvailable: boolean;
    menuIngredientListList: IMenuIngredientList[];
}