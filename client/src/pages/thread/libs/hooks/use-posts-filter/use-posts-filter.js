import { createReducer } from '@reduxjs/toolkit';
import { useCallback, useReducer } from 'react';

import { PostsFilterAction } from '~/libs/enums/enums.js';

const postsFilterInitialState = {
  userId: undefined,
  likedByOwn: undefined
};

const postsFilterReducer = createReducer(postsFilterInitialState, builder => {
  builder.addCase(PostsFilterAction.TOGGLE_SHOW_OWN_POSTS, (state, action) => {
    state.userId = action.payload.userId;
    state.likedByOwn = action.payload.likedByOwn;
  });
  builder.addCase(PostsFilterAction.TOGGLE_SHOW_LIKED_BY_OWN_POST, (state, action) => {
    state.userId = action.payload.userId;
    state.likedByOwn = action.payload.likedByOwn;
  });
});

const usePostsFilter = () => {
  const [postsFilter, dispatchPostsFilter] = useReducer(
    postsFilterReducer,
    postsFilterInitialState
  );

  const handleShownOwnPosts = useCallback(userId => {
    dispatchPostsFilter({
      type: PostsFilterAction.TOGGLE_SHOW_OWN_POSTS,
      payload: {
        userId,
        likedByOwn: undefined
      }
    });
  }, []);

  const handleShowLikedByOwnPosts = useCallback(userId => {
    dispatchPostsFilter({
      type: PostsFilterAction.TOGGLE_SHOW_LIKED_BY_OWN_POST,
      payload: {
        userId,
        likedByOwn: true
      }
    });
  }, []);

  return { postsFilter, handleShownOwnPosts, handleShowLikedByOwnPosts };
};

export { usePostsFilter };
