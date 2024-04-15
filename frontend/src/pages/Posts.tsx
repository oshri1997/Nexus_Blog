import { useEffect, useState } from "react";
import { IPost } from "../types";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import PostCard from "../components/PostCard";
import { Button } from "flowbite-react";

export default function Posts() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [showMore, setShowMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(true);
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts`);
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const handleShowMore = async () => {
    const startIndex = posts.length;
    try {
      const res = await fetch(`/api/post/getposts?start=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setPosts((prevPosts: IPost[]) => [...prevPosts, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="max-w-[1500px] w-full mx-auto !bg-background  ">
      <div className="grid justify-center w-full  lg:grid-cols-2 xl:grid-cols-3 gap-4 p-7">
        {loading && (
          <>
            <div className="group  mx-auto  relative  border  hover:border-2 transition-all h-[400px] overflow-hidden rounded-lg sm:w-[430px] animate-pulse">
              <div className="h-64 w-full bg-gray-800 transition-all duration-300 z-20"></div>
              <div className="p-3 flex flex-col gap-2">
                <div className="h-6 bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-800 rounded w-1/3"></div>
              </div>
            </div>
            <div className="group  mx-auto  relative  border  hover:border-2 transition-all h-[400px] overflow-hidden rounded-lg sm:w-[430px] animate-pulse">
              <div className="h-64 w-full bg-gray-800 transition-all duration-300 z-20"></div>
              <div className="p-3 flex flex-col gap-2">
                <div className="h-6 bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-800 rounded w-1/3"></div>
              </div>
            </div>
            <div className="group  mx-auto  relative  border  hover:border-2 transition-all h-[400px] overflow-hidden rounded-lg sm:w-[430px] animate-pulse">
              <div className="h-64 w-full bg-gray-800 transition-all duration-300 z-20"></div>
              <div className="p-3 flex flex-col gap-2">
                <div className="h-6 bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-800 rounded w-1/3"></div>
              </div>
            </div>
            <div className="group  mx-auto  relative  border  hover:border-2 transition-all h-[400px] overflow-hidden rounded-lg sm:w-[430px] animate-pulse">
              <div className="h-64 w-full bg-gray-800 transition-all duration-300 z-20"></div>
              <div className="p-3 flex flex-col gap-2">
                <div className="h-6 bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-800 rounded w-1/3"></div>
              </div>
            </div>
            <div className="group  mx-auto  relative  border  hover:border-2 transition-all h-[400px] overflow-hidden rounded-lg sm:w-[430px] animate-pulse">
              <div className="h-64 w-full bg-gray-800 transition-all duration-300 z-20"></div>
              <div className="p-3 flex flex-col gap-2">
                <div className="h-6 bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-800 rounded w-1/3"></div>
              </div>
            </div>
            <div className="group  mx-auto  relative  border  hover:border-2 transition-all h-[400px] overflow-hidden rounded-lg sm:w-[430px] animate-pulse">
              <div className="h-64 w-full bg-gray-800 transition-all duration-300 z-20"></div>
              <div className="p-3 flex flex-col gap-2">
                <div className="h-6 bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-800 rounded w-1/3"></div>
              </div>
            </div>
            <div className="group  mx-auto  relative  border  hover:border-2 transition-all h-[400px] overflow-hidden rounded-lg sm:w-[430px] animate-pulse">
              <div className="h-64 w-full bg-gray-800 transition-all duration-300 z-20"></div>
              <div className="p-3 flex flex-col gap-2">
                <div className="h-6 bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-800 rounded w-1/3"></div>
              </div>
            </div>
          </>
        )}
        {!loading && posts.length === 0 && <p> No Posts Found</p>}
        {!loading && posts.map((post) => <PostCard key={post._id} post={post} />)}
      </div>
      {showMore && (
        <div className="flex justify-center">
          <Button
            onClick={handleShowMore}
            className=" rounded-md p-2 mb-3"
            gradientDuoTone="purpleToBlue"
          >
            Show More
          </Button>
        </div>
      )}
    </div>
  );
}
