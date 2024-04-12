import Post from "../models/post.model.js";

export const createController = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next({ status: 401, message: "You are not authorized to create a post" });
  }
  if (!req.body.title || !req.body.content) {
    return next({ status: 400, message: "Please fill in all fields" });
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z-]/g, "-");

  try {
    const post = await new Post({
      ...req.body,
      slug,
      userId: req.user.id,
    }).save();
    console.log(post);
    res.status(201).json(post);
  } catch (error) {
    next({ status: 400, message: error });
  }
};
export const getPostsController = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1; // 1 for ascending, -1 for descending
    const posts = await Post.find({
      ...(req.query.userid && { userId: req.query.userid }),
      ...(req.query.category && { categories: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postid && { _id: req.query.postid }),
      ...(req.query.search && {
        $or: [
          { title: { $regex: req.query.search, $options: "i" } },
          { content: { $regex: req.query.search, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalPosts = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()); // get the date one month ago
    const postsInLastMonth = await Post.countDocuments({ createdAt: { $gte: oneMonthAgo } }); // get the number of posts created in the last month
    res.status(200).json({ posts, totalPosts, postsInLastMonth });
  } catch (error) {
    next({ status: 400, message: error });
  }
};

export const deletePostController = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userid) {
    return next({ status: 401, message: "You are not authorized to delete this post" });
  }
  try {
    await Post.findByIdAndDelete(req.params.postid);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next({ status: 400, message: error });
  }
};
export const updatePostController = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userid) {
    return next({ status: 401, message: "You are not authorized to update this post" });
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postid,
      {
        $set: {
          title: req.body.title,
          category: req.body.category,
          content: req.body.content,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next({ status: 400, message: error });
  }
};
