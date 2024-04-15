import { Link } from "react-router-dom";
import { IPost } from "../types";

interface PostCardProps {
  post: IPost;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="group  mx-auto relative w-full border border-teal-500 hover:border-2 transition-all  h-[400px] overflow-hidden rounded-lg sm:w-[430px]">
      <Link to={`/post/${post.slug}`}>
        <img
          className="h-64 w-full object-cover group-hover:h-52 transition-all duration-300 z-20"
          src={post.image}
          alt={post.title}
        />
        <div className="p-3 flex flex-col gap-2 ">
          <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
          <span className="italic textsm">{post.category}</span>
          <Link
            className="z-10 absolute group-hover:bottom-0 -bottom-52 left-0 right-0 border border-teal-500 rounded-tl-none m-2 text-teal-500 hover:bg-teal-500 rounded-md  hover:text-white transition-all duration-300 py-2 text-center"
            to={`/post/${post.slug}`}
          >
            Read More
          </Link>
        </div>
      </Link>
    </div>
  );
}
