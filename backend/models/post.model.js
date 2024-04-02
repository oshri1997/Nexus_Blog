import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://media.istockphoto.com/id/1328279769/vector/new-blog-post-origami-style-speech-bubble-banner-sticker-design-template-with-new-blog-post.jpg?s=612x612&w=0&k=20&c=dPGeqdbDUPgUVmaNWrnM1ZvEcL4sePQHuyj03RIfRww=",
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
