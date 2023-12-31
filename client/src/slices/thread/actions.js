import { createAsyncThunk } from '@reduxjs/toolkit';

import { ActionType } from './common.js';

const loadPosts = createAsyncThunk(
  ActionType.SET_ALL_POSTS,
  async (filters, { getState, extra: { services } }) => {
    const {
      posts: { count }
    } = getState();

    const posts = await services.post.getAllPosts({
      from: 0,
      count,
      ...filters
    });
    return { posts };
  }
);

const loadMorePosts = createAsyncThunk(
  ActionType.LOAD_MORE_POSTS,
  async (filters, { getState, extra: { services } }) => {
    const {
      posts: { posts, from, count }
    } = getState();
    const loadedPosts = await services.post.getAllPosts({
      from,
      count,
      ...filters
    });
    const filteredPosts = loadedPosts.filter(
      post => !(posts && posts.some(loadedPost => post.id === loadedPost.id))
    );

    return { posts: filteredPosts };
  }
);

const applyPost = createAsyncThunk(
  ActionType.ADD_POST,
  async ({ id: postId, userId }, { getState, extra: { services } }) => {
    const {
      profile: { user }
    } = getState();
    if (userId === user.id) {
      return { post: null };
    }

    const post = await services.post.getPost(postId);
    return { post };
  }
);

const createPost = createAsyncThunk(
  ActionType.ADD_POST,
  async (post, { extra: { services } }) => {
    const { id } = await services.post.addPost(post);
    const newPost = await services.post.getPost(id);

    return { post: newPost };
  }
);

const toggleExpandedPost = createAsyncThunk(
  ActionType.SET_EXPANDED_POST,
  async (postId, { extra: { services } }) => {
    const post = postId ? await services.post.getPost(postId) : undefined;
    return { post };
  }
);

const reactPostSocket = createAsyncThunk(
  ActionType.REACT,
  async (postId, { getState, extra: { services } }) => {
    const updatePost = await services.post.getPost(postId);

    const {
      posts: { posts }
    } = getState();
    const updatedPosts = posts.map(post => (post.id === postId ? updatePost : post));

    return { posts: updatedPosts };
  }
);

const showChange = (getState, change, postId) => {
  const mapChange = post => ({
    ...post,
    ...change
  });

  const {
    posts: { posts, expandedPost }
  } = getState();
  const updated = posts.map(post =>
    post.id === postId ? mapChange(post) : post
  );
  const updatedExpandedPost =
    expandedPost?.id === postId ? mapChange(expandedPost) : undefined;

  return { posts: updated, expandedPost: updatedExpandedPost };
};

const likePost = createAsyncThunk(
  ActionType.REACT,
  async (postId, { getState, extra: { services } }) => {
    const countReaction = await services.post.likePost(postId);
    return showChange(getState, countReaction, postId);
  }
);

const dislikePost = createAsyncThunk(
  ActionType.REACT,
  async (postId, { getState, extra: { services } }) => {
    const countReaction = await services.post.dislikePost(postId);
    return showChange(getState, countReaction, postId);
  }
);

const updatePost = createAsyncThunk(
  ActionType.UPDATE_POST,
  async (post, { getState, extra: { services } }) => {
    const updatedPost = await services.post.updatePost(post);
    return showChange(getState, updatedPost, post.id);
  }
);

const deletePost = createAsyncThunk(
  ActionType.DELETE_POST,
  async (id, { getState, extra: { services } }) => {
    await services.post.deletePost(id);
    const {
      posts: { posts }
    } = getState();
    const updated = posts.filter(post => post.id !== id);

    return { posts: updated };
  }
);
const addComment = createAsyncThunk(
  ActionType.COMMENT,
  async (request, { getState, extra: { services } }) => {
    const { id } = await services.comment.addComment(request);
    const comment = await services.comment.getComment(id);

    const mapComments = post => ({
      ...post,
      commentCount: Number(post.commentCount) + 1,
      comments: [...(post.comments || []), comment] // comment is taken from the current closure
    });

    const {
      posts: { posts, expandedPost }
    } = getState();
    const updated = posts.map(post =>
      post.id === comment.postId ? mapComments(post) : post
    );

    const updatedExpandedPost =
      expandedPost?.id === comment.postId
        ? mapComments(expandedPost)
        : undefined;

    return { posts: updated, expandedPost: updatedExpandedPost };
  }
);

export {
  addComment,
  applyPost,
  createPost,
  deletePost,
  dislikePost,
  likePost,
  loadMorePosts,
  loadPosts,
  reactPostSocket,
  toggleExpandedPost,
  updatePost
};
