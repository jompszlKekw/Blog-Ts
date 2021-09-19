import {
  CREATE_BLOGS_USER_ID,
  DELETE_BLOGS_USER_ID,
  IDeleteBlogsUserType,
} from './../types/blogType';
import { deleteAPI, putAPI } from './../../utils/FetchData';
import { Dispatch } from 'redux';
import { IBlog } from '../../utils/TypeScript';
import { imageUpload } from '../../utils/ImageUpload';
import { ALERT, IAlertType } from '../types/alertType';
import { getAPI, postAPI } from '../../utils/FetchData';
import {
  GET_HOME_BLOGS,
  IGetHomeBlogsType,
  GET_BLOGS_CATEGORY_ID,
  IGetBlogsCategoryType,
  GET_BLOGS_USER_ID,
  IGetBlogsUserType,
  ICreateBlogsUserType,
} from '../types/blogType';
import { checkTokenExp } from '../../utils/checkTokenExp';

export const createBlog =
  (blog: IBlog, token: string) =>
  async (dispatch: Dispatch<IAlertType | ICreateBlogsUserType>) => {
    const result = await checkTokenExp(token, dispatch);
    const access_token = result ? result : token;

    let url;
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      if (typeof blog.thumbnail !== 'string') {
        const photo = await imageUpload(blog.thumbnail);
        url = photo.url;
      } else {
        url = blog.thumbnail;
      }

      const newBlog = { ...blog, thumbnail: url };
      const res = await postAPI('createBlog', newBlog, access_token);

      dispatch({ type: CREATE_BLOGS_USER_ID, payload: res.data });

      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

export const getHomeBlogs =
  () => async (dispatch: Dispatch<IAlertType | IGetHomeBlogsType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await getAPI('home/blogs');

      dispatch({ type: GET_HOME_BLOGS, payload: res.data });

      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

export const getBlogsByCategoryId =
  (id: string, search: string) =>
  async (dispatch: Dispatch<IAlertType | IGetBlogsCategoryType>) => {
    try {
      let limit = 8;
      let value = search ? search : `?page=${1}`;
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await getAPI(`blogs/category/${id}${value}&limit=${limit}`);

      dispatch({
        type: GET_BLOGS_CATEGORY_ID,
        payload: { ...res.data, id, search },
      });

      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

export const getBlogsByUserId =
  (id: string, search: string) =>
  async (dispatch: Dispatch<IAlertType | IGetBlogsUserType>) => {
    try {
      let limit = 3;
      let value = search ? search : `?page=${1}`;

      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await getAPI(`blogs/user/${id}${value}&limit=${limit}`);

      dispatch({
        type: GET_BLOGS_USER_ID,
        payload: { ...res.data, id, search },
      });

      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

export const updateBlog =
  (blog: IBlog, token: string) => async (dispatch: Dispatch<IAlertType>) => {
    const result = await checkTokenExp(token, dispatch);
    const access_token = result ? result : token;

    let url;
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      if (typeof blog.thumbnail !== 'string') {
        const photo = await imageUpload(blog.thumbnail);
        url = photo.url;
      } else {
        url = blog.thumbnail;
      }

      const newBlog = { ...blog, thumbnail: url };
      const res = await putAPI(
        `updateBlog/${newBlog._id}`,
        newBlog,
        access_token
      );

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

export const deleteBlog =
  (blog: IBlog, token: string) =>
  async (dispatch: Dispatch<IAlertType | IDeleteBlogsUserType>) => {
    const result = await checkTokenExp(token, dispatch);
    const access_token = result ? result : token;
    try {
      dispatch({ type: DELETE_BLOGS_USER_ID, payload: blog });

      await deleteAPI(`blog/${blog._id}`, access_token);

      dispatch({ type: ALERT, payload: {} });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };
