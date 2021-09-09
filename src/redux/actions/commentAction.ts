import { Dispatch } from "redux";

import { ALERT, IAlertType } from "../types/alertType";
import {
  CREATE_COMMENT,
  GET_COMMENTS,
  ICreateCommentType,
  IGetCommentsType,
  IReplyCommentType,
  IUpdateType,
  REPLY_COMMENTS,
  UPDATE_COMMENTS,
  UPDATE_REPLY,
} from "../types/commentType";

import { IComment } from "../../utils/TypeScript";
import { getAPI, postAPI } from "../../utils/FetchData";

export const createComment =
  (data: IComment, token: string) =>
  async (dispatch: Dispatch<IAlertType | ICreateCommentType>) => {
    try {
      const res = await postAPI("comment", data, token);

      dispatch({
        type: CREATE_COMMENT,
        payload: { ...res.data, user: data.user },
      });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

export const getComments =
  (id: string, num: number) => async (dispatch: Dispatch<IAlertType | IGetCommentsType>) => {
    try {
      const limit = 4;
      const res = await getAPI(`comments/blog/${id}?page=${num}&limit=${limit}`);

      dispatch({
        type: GET_COMMENTS,
        payload: { data: res.data.comments, total: res.data.total },
      });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

export const replyComment =
  (data: IComment, token: string) =>
  async (dispatch: Dispatch<IAlertType | IReplyCommentType>) => {
    try {
      const res = await postAPI("reply_comment", data, token);

      dispatch({
        type: REPLY_COMMENTS,
        payload: { ...res.data, user: data.user, reply_user: data.reply_user },
      });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };


export const updateComment =
  (data: IComment, token: string) =>
  async (dispatch: Dispatch<IAlertType | IUpdateType>) => {
    try {
      dispatch({
        type: data.comment_root ? UPDATE_REPLY : UPDATE_COMMENTS,
        payload: data,
      });
      console.log({ data, token })
      // const res = await postAPI("comment", data, token);
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };