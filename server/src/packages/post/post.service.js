class PostService {
  constructor({ postRepository, postReactionRepository }) {
    this._postRepository = postRepository;
    this._postReactionRepository = postReactionRepository;
  }

  getPosts(filter) {
    return this._postRepository.getPosts(filter);
  }

  getById(id) {
    return this._postRepository.getPostById(id);
  }

  create(userId, post) {
    return this._postRepository.create({
      ...post,
      userId
    });
  }

  async setReaction(userId, { postId, isLike = true }) {
    const updateOrDelete = react => {
      return react.isLike === isLike
        ? this._postReactionRepository.deleteById(react.id)
        : this._postReactionRepository.updateById(react.id, { isLike });
    };

    const reaction = await this._postReactionRepository.getPostReaction(
      userId,
      postId
    );

    const result = reaction
      ? await updateOrDelete(reaction)
      : await this._postReactionRepository.create({ userId, postId, isLike });

    // the result is an integer when an entity is deleted
    return Number.isInteger(result)
      ? {}
      : this._postReactionRepository.getPostReaction(userId, postId);
  }
}

export { PostService };
