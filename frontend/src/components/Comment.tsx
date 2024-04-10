import { Button, Modal, Textarea } from "flowbite-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";

interface Comment {
  _id: string;
  content: string;
  userId: string;
  postId: string;
  likes: string[];
  createdAt: Date;
}

interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  profilePicture: string;
  createdAt: Date;
}

interface commentProps {
  comment: Comment;
  currentUser: User;
  onLike: (commentId: string) => void;
  onEdit: (comment: Comment, content: string) => void;
  onDelete: (commentId: string) => void;
}

export default function Comment({
  comment,
  currentUser,
  onLike,
  onEdit,
  onDelete,
}: commentProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.content);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`/api/user/${comment?.userId}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getUser();
  }, [comment]);

  const openEdit = () => {
    setIsEditing(true);
    setEditedComment(comment.content);
  };
  const handleSave = async () => {
    try {
      const response = await fetch(`/api/comment/editcomment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedComment }),
      });
      if (response.ok) {
        onEdit(comment, editedComment);
        setIsEditing(false);
      }
    } catch (error) {}
  };
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleDeleteComment = async () => {
    onDelete(comment._id);
    setShowModal(false);
  };
  return (
    <div className="flex p-4  border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="size-10 rounded-full bg-gray-200"
          src={user?.profilePicture}
          alt={user?.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="'text-gray-500 text-xs">{moment(comment.createdAt).fromNow()}</span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              value={editedComment}
              className="mb-2"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setEditedComment(e.target.value);
              }}
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                onClick={handleSave}
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
              >
                Save
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                type="button"
                outline
                size="sm"
                gradientDuoTone="purpleToBlue"
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment?.content}</p>
            <div className="flex gap-2 items-center pt-2 text-xs border-t dark:border-gray-700">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={` hover:text-blue-500 hover:scale-125 transition-all hover:-rotate-12 ${
                  currentUser && comment.likes.includes(currentUser._id)
                    ? "text-blue-500"
                    : "text-gray-400"
                } `}
              >
                <FaThumbsUp className="text-xs" />
              </button>
              <p className="text-gray-500 ">
                {comment.likes.length > 0 &&
                  (comment.likes.length === 1
                    ? `${comment.likes.length} like`
                    : `${comment.likes.length} likes`)}
              </p>
              {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                <>
                  <button
                    type="button"
                    onClick={openEdit}
                    className="text-xs text-gray-500 hover:text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenModal}
                    className="text-xs text-gray-500 hover:text-blue-500"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
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
                Yes, delete my comment!
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
