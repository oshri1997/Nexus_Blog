import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toastF } from "../helpers";
import { IPost } from "../types";
/**
 * Represents a blog post.
 */

export default function DashPosts() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [userPosts, setUserPosts] = useState<IPost[]>([]);
  const [showMore, setShowMore] = useState<boolean>(true);
  const [postIdToDelete, setPostIdToDelete] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userid=${currentUser?._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPosts();
  }, []);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getposts?userid=${currentUser?._id}&start=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prevPosts: IPost[]) => [...prevPosts, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser?._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        setUserPosts((prevPosts: IPost[]) =>
          prevPosts.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      toastF("error", "An error occurred. Please try again later.");
    }
  };
  return (
    <div className=" w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700   ">
      {currentUser?.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Last Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Post Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y-2">
              {userPosts.map((post: IPost) => (
                <Table.Row key={post._id}>
                  <Table.Cell className="text-slate-800  dark:text-slate-400 font-medium">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="size-20 object-cover rounded-md bg-slate-600"
                      />
                    </Link>
                  </Table.Cell>

                  <Table.Cell>
                    <Link
                      className=" text-slate-800  dark:text-slate-400 font-medium"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>

                  <Table.Cell className="text-slate-800  dark:text-slate-400 font-medium">
                    {post.category}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className=" font-semibold cursor-pointer hover:underline text-red-500"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <span className="font-semibold text-teal-500 hover:underline">Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p>You have no posts yet!</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="size-14 text=gray-400 mb-4 mx-auto dark:text-gray-200" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-300">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, delete this post.
              </Button>
              <Button onClick={() => setShowModal(false)} color="gray">
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
