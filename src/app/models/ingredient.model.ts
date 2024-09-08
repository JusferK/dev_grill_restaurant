export interface IMenuIngredientList {
    idMenuIngredientList: number;
    quantity: number;
    ingredientName: string;
    idMenu: number;
    idIngredient: number;
}


export interface IIngredient {
    idIngredient?: number;
    name: string;
    stock: number;
    MenuIngredientListList?: IMenuIngredientList;
}