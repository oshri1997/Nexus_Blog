import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toastF } from "../helpers";
import { Button } from "flowbite-react";
import Comments from "../components/Comments";
import { IPost } from "../types";
import PostCard from "../components/PostCard";

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [recentPosts, setRecentPosts] = useState<IPost[] | null>(null);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${slug}`);
        const data = await res.json();
        if (!res.ok) {
          return toastF(data.message, "error");
        }
        if (data.posts.length === 0) {
          return toastF("Post not found", "error");
        }
        setPost(data.posts[0]);
        setLoading(false);
      } catch (error) {
        toastF("Error while fetching post", "error");
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch("/api/post/getposts?limit=3");
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      } catch (error) {
        toastF("Error while fetching recent posts", "error");
      }
    };
    fetchRecentPosts();
  }, []);

  if (loading) {
    return (
      <div
        role="status"
        className="max-w-7xl mx-auto p-4  animate-pulse   min-h-screen  md:p-6 "
      >
        <div className="h-8 mx-auto bg-gray-200 mt-10 rounded-full dark:bg-gray-700 w-96 mb-4"></div>
        <div className="h-3  mx-auto bg-gray-200 rounded-full dark:bg-gray-700 w-10 mb-4"></div>

        <div className="flex items-center justify-center h-screen max-h-[600px]  w-full mb-4 bg-gray-300 rounded dark:bg-gray-700">
          <svg
            className="w-10 h-10 text-gray-200 dark:text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 20"
          >
            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
          </svg>
        </div>
        <div className="flex mb-10  justify-between p-3 border-b border-slate-500 w-full max-w-2xl text-xs mx-auto">
          <div className="h-4 w-12 bg-gray-200 rounded-full dark:bg-gray-700 "></div>
          <div className="h-4 w-12 bg-gray-200 rounded-full dark:bg-gray-700 "></div>
        </div>
        <div className="h-2 w-2/3 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 w-2/3 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>

        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 w-2/3 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>

        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 w-2/3 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>

        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
      </div>
    );
  }
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post?.title}
      </h1>
      <Link className="self-center mt-5" to={`/search?categoy=${post?.category}`}>
        <Button color="gray" pill size="xs">
          {post?.category}
        </Button>
      </Link>
      <img
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
        src={post?.image}
        alt={post?.title}
      />
      <div className="flex justify-between p-3 border-b border-slate-500 w-full max-w-2xl text-xs mx-auto">
        <span>{new Date(post?.createdAt!).toLocaleDateString()}</span>
        <span className="italic">
          {(post?.content.length! / 1000).toFixed(0)} minutes to read
        </span>
      </div>
      <div
        className="p-3 max-w-4xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post?.content! }}
      ></div>
      <Comments postId={post?._id!} />
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent Articles</h1>
        <div className="flex justify-center w-full mt-5  items-center mx-auto flex-col md:flex-row  gap-5">
          {recentPosts &&
            recentPosts?.map((post) => <PostCard key={post._id} post={post}></PostCard>)}
        </div>
      </div>
    </main>
  );
}
