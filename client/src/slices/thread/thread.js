import {
  addComment,
  applyPost,
  createPost,
  dislikePost,
  likePost,
  loadMorePosts,
  loadPosts,
  toggleExpandedPost
} from './actions.js';
import { actions } from './thread.slice.js';

const allActions = {
  ...actions,
  loadPosts,
  loadMorePosts,
  applyPost,
  createPost,
  toggleExpandedPost,
  dislikePost,
  likePost,
  addComment
};

export { allActions as actions };
export { reducer } from './thread.slice.js';
