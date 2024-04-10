import Comment from "../models/comment.model.js";

export const createCommentController = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;
    if ((!content, !postId)) {
      return res.status(400).json({ message: "Content, postId and userId are required" });
    }
    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    next({ message: error.message, status: 400 });
  }
};

export const getCommentsController = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    next({ message: error.message, status: 400 });
  }
};

export const likeCommentController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const comment = await Comment.findById(req.params.commentid);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter((id) => id.toString() !== userId);
    } else {
      comment.likes.push(userId);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next({ message: error.message, status: 400 });
  }
};

export const editCommentController = async (req, res, next) => {
  try {
    const { content } = req.body;

    const comment = await Comment.findById(req.params.commentid);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "You are not allowed to edit this comment" });
    }
    comment.content = content;
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next({ message: error.message, status: 400 });
  }
};
export const deleteCommentController = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentid);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "You are not allowed to delete this comment" });
    }
    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    next({ message: error.message, status: 400 });
  }
};
