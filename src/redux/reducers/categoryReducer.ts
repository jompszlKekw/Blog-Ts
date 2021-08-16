import { CREATE_CATEGORY, GET_CATEGORY, ICategoryType } from '../types/categoryType'
import { ICategory } from '../../utils/TypeScript'

const categoryReducer = (state: ICategory[] = [], action: ICategoryType) : ICategory[] => {
  switch (action.type) {
    case CREATE_CATEGORY :
      return [action.payload, ...state];
    case GET_CATEGORY:
      return action.payload
    default:
      return state;
  }
}

export default categoryReducer