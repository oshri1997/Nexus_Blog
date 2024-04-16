import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { IPost, ISearchData } from "../types";
import { useNavigate, useSearchParams } from "react-router-dom";
import PostCard from "../components/PostCard";
export default function Search() {
  const [sidebarData, setSidebarData] = useState<ISearchData>({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const searchTermFromUrl = searchParams.get("searchTerm");
    const sortFromUrl = (searchParams.get("sort") as "desc" | "asc") || "desc";
    const categoryFromUrl = searchParams.get("category") || "uncategorized";
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        sort: sortFromUrl || "desc",
        category: categoryFromUrl || "uncategorized",
      });
    }
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/post/getposts?${searchParams}`);
        const data = await response.json();
        if (response.ok) {
          setLoading(false);
          setPosts(data.posts);
          if (data.posts.length === 9) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchPosts();
  }, [searchParams]);

  const handleChange = (e: any) => {
    setSidebarData({
      ...sidebarData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    searchParams.set("searchTerm", sidebarData.searchTerm);
    searchParams.set("sort", sidebarData.sort);
    searchParams.set("category", sidebarData.category);
    navigate(`/search?${searchParams}`);
    try {
      const response = await fetch(`/api/post/getposts?${searchParams}`);
      const data = await response.json();

      if (response.ok) {
        setLoading(false);
        setPosts(data.posts);

        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

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
    <div className="flex flex-col md:flex-row bg-background">
      <div className="p-7 border-b md:border-r md:min-h-screen border-x-gray-500">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term:</label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="wwhitespace-nowrap font-semibold">Sort:</label>
            <Select id="sort" onChange={handleChange} value={sidebarData.sort}>
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="wwhitespace-nowrap font-semibold">Catergory:</label>
            <Select onChange={handleChange} value={sidebarData.category} id="category">
              <option value="uncategorized">Select a catergory</option>
              <option value="react">React</option>
              <option value="vue">Vue</option>
              <option value="angular">Angular</option>
              <option value="next">Next</option>
              <option value="Javascript">javascript</option>
              <option value="typescript">Typescript</option>
              <option value="nodejs">NodeJs</option>
              <option value="state mangement">State Mangement</option>
              <option value="css">CSS</option>
              <option value="html">HTML</option>
              <option value="testing">Testing</option>
            </Select>
          </div>
          <Button type="submit" gradientDuoTone="purpleToBlue" pill>
            Search
          </Button>
        </form>
      </div>
      <div className="w-full">
        {
          <div className="grid grid-cols-1  xl:grid-cols-2  gap-4 p-7 2xl:grid-cols-3 ">
            {loading && <p>Loading...</p>}
            {!loading && posts.length === 0 && <p> No Posts Found</p>}
            {!loading && posts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>
        }
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
    </div>
  );
}
