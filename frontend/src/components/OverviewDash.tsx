import { useEffect, useState } from "react";
import { IComment, ILoggedInUser, IPost } from "../types";
import { HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from "react-icons/hi";
import { BiSolidCommentDetail } from "react-icons/bi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

export default function OverviewDash() {
  const [users, setUsers] = useState<ILoggedInUser[] | null>(null);
  const [posts, setPosts] = useState<IPost[] | null>(null);
  const [comments, setComments] = useState<IComment[] | null>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [lastMonthUsers, setLastMonthUsers] = useState<number>(0);
  const [lastMonthPosts, setLastMonthPosts] = useState<number>(0);
  const [lastMonthComments, setLastMonthComments] = useState<number>(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/user/getusers?limit=5");
        const data = await response.json();
        if (response.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.usersInLastMonth);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/post/getposts?limit=5");
        const data = await response.json();
        if (response.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.postsInLastMonth);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchComments = async () => {
      try {
        const response = await fetch("/api/comment/getcomments?limit=5");
        const data = await response.json();
        if (response.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.commentsInLastMonth);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
    fetchPosts();
    fetchComments();
  }, []);
  if (!users || !posts || !comments)
    return (
      <div className="p-3 md:mx-auto">
        <div className="flex  gap-4 ">
          <div className="h-36 w-72 rounded-md animate-pulse bg-gray-200  dark:bg-gray-700"></div>
          <div className="h-36 w-72 rounded-md animate-pulse bg-gray-200  dark:bg-gray-700"></div>
          <div className="h-36 w-72 rounded-md animate-pulse bg-gray-200  dark:bg-gray-700"></div>
        </div>
        <div className="flex gap-4 py-3 mx-auto  justify-center">
          <div className="h-96 w-72 rounded-md animate-pulse bg-gray-200  dark:bg-gray-700"></div>
          <div className="h-96 w-72 rounded-md animate-pulse bg-gray-200  dark:bg-gray-700"></div>
          <div className="h-96 w-72 rounded-md animate-pulse bg-gray-200  dark:bg-gray-700"></div>
        </div>
      </div>
    );
  return (
    <div className="p-3 md:mx-auto">
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
              <p className="text-2xl">{totalPosts}</p>
            </div>
            <HiDocumentText className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total comments</h3>
              <p className="text-2xl">{totalComments}</p>
            </div>
            <BiSolidCommentDetail className="bg-blue-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 py-3 mx-auto  justify-center">
        <div className="flex flex-col w-full md:w-auto shadow-md -2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Users</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to="/dashboard?tab=users">View All</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {users.map((user) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={user._id}
                >
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="size-10 bg-gray-500 rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md -2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Posts</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to="/dashboard?tab=posts">View All</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Post Catergory</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {posts.map((post) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={post._id}
                >
                  <Table.Cell>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="size-10 bg-gray-500 rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell>{post.title}</Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md -2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Comments</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to="/dashboard?tab=comments">View All</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comment Content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {comments.map((comment) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={comment._id}
                >
                  <Table.Cell>
                    <p>{comment.content}</p>
                  </Table.Cell>
                  <Table.Cell>{comment.likes.length}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
}
