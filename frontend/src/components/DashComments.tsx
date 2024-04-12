import { useEffect, useState } from "react";
import { IComment } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Button, Modal, Table } from "flowbite-react";
import { toastF } from "../helpers";
import { HiOutlineExclamationCircle } from "react-icons/hi";
export default function DashComments() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [comments, setComments] = useState<IComment[]>([]);
  const [showMore, setShowMore] = useState<boolean>(true);
  const [commentIdToDelete, setCommentIdToDelete] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  useEffect(() => {
    const fetcComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser?.isAdmin) {
      fetcComments();
    }
  }, [currentUser?._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/comment/getcomments&start=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setComments((prevComments: IComment[]) => [...prevComments, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/deletecomment/${commentIdToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        setComments((prevComments: IComment[]) =>
          prevComments.filter((comment) => comment._id !== commentIdToDelete)
        );
      }
    } catch (error) {
      toastF("error", "An error occurred. Please try again later.");
    }
  };
  return (
    <div className=" w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700   ">
      {currentUser?.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Updated Date</Table.HeadCell>
              <Table.HeadCell>Comment Content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
              <Table.HeadCell>Post ID</Table.HeadCell>
              <Table.HeadCell>User Id</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y-2">
              {comments.map((comment: IComment) => (
                <Table.Row key={comment._id}>
                  <Table.Cell className="text-slate-800  dark:text-slate-400 font-medium">
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>

                  <Table.Cell>{comment.content}</Table.Cell>

                  <Table.Cell className="text-slate-800  dark:text-slate-400 font-medium">
                    {comment.likes!.length}
                  </Table.Cell>
                  <Table.Cell className="text-slate-800  dark:text-slate-400 font-medium">
                    {comment.postId}
                  </Table.Cell>
                  <Table.Cell className="text-slate-800  dark:text-slate-400 font-medium">
                    {comment.userId}
                  </Table.Cell>

                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                      className=" font-semibold cursor-pointer hover:underline text-red-500"
                    >
                      Delete
                    </span>
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
        <p>You have no comments yet!</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="size-14 text=gray-400 mb-4 mx-auto dark:text-gray-200" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-300">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>
                Yes, delete this comment.
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
