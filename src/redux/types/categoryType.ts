import { ICategory } from "../../utils/TypeScript";

export const CREATE_CATEGORY = "CREATE_CATEGORY";
export const GET_CATEGORY = "GET_CATEGORY";

export interface ICreateCategory {
  type: typeof CREATE_CATEGORY;
  payload: ICategory;
}

export interface IGetCategory {
  type: typeof GET_CATEGORY;
  payload: ICategory[];
}

export type ICategoryType = ICreateCategory | IGetCategory