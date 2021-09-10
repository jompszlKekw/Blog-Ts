import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootStore, IComment } from './utils/TypeScript';

import {
  CREATE_COMMENT,
  DELETE_COMMENTS,
  DELETE_REPLY,
  REPLY_COMMENTS,
  UPDATE_COMMENTS,
  UPDATE_REPLY,
} from './redux/types/commentType';

export default function SocketClient() {
  const { socket } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    socket.on('createComment', (data: IComment) => {
      dispatch({
        type: CREATE_COMMENT,
        payload: data,
      });
    });

    return () => {
      socket.off('createComment');
    };
  }, [socket, dispatch]);

  useEffect(() => {
    if (!socket) return;

    socket.on('replyComment', (data: IComment) => {
      dispatch({ type: REPLY_COMMENTS, payload: data });
    });

    return () => {
      socket.off('replyComment');
    };
  }, [socket, dispatch]);

  useEffect(() => {
    if (!socket) return;

    socket.on('updateComment', (data: IComment) => {
      dispatch({
        type: data.comment_root ? UPDATE_REPLY : UPDATE_COMMENTS,
        payload: data,
      });
    });

    return () => {
      socket.off('updateComment');
    };
  }, [socket, dispatch]);

  useEffect(() => {
    if (!socket) return;

    socket.on('deleteComment', (data: IComment) => {
      dispatch({
        type: data.comment_root ? DELETE_REPLY : DELETE_COMMENTS,
        payload: data,
      });
    });

    return () => {
      socket.off('deleteComment');
    };
  }, [socket, dispatch]);

  return <div></div>;
}
