import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { toastF } from "../helpers";
import Comment from "./Comment";
import { IComment } from "../types";

interface CommentsProps {
  postId: string;
}
export default function Comments({ postId }: CommentsProps) {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<IComment[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comment/getcomments/${postId}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (error) {
        toastF("An error occurred", "error");
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!comment || comment.trim() === "") {
      return toastF("Comment cannot be empty", "error");
    }
    try {
      const response = await fetch("/api/comment/createcomment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser?._id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComment("");
        setComments([data, ...comments]);
        return toastF("Comment published", "success");
      }
    } catch (error) {
      console.error(error);
      toastF("An error occurred", "error");
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comment/likecomment/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        const updatedComments = comments.map((comment) =>
          comment._id === data._id ? data : comment
        );
        setComments(updatedComments);
      } else {
        navigate("/sign-in");
        toastF("You must be signed in to like a comment", "error");
      }
    } catch (error) {
      toastF("An error occurred", "error");
    }
  };
  const handleEdit = async (comment: IComment, editedComment: string) => {
    setComments(
      comments.map((c) => (c._id === comment._id ? { ...c, content: editedComment } : c))
    );
  };
  const handleDelete = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comment/deletecomment/${commentId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setComments(comments.filter((comment) => comment._id !== commentId));
        toastF("Comment deleted", "success");
      } else {
        toastF("You are not authorized to delete this comment", "error");
      }
    } catch (error) {
      toastF("An error occurred", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-sm text-gray-500">
          <p className="">Signed in as: </p>
          <img
            className="size-5 object-cover  rounded-full"
            src={currentUser.profilePicture}
            alt={currentUser.username}
          />
          <Link className="text-xs text-cyan-600 hover:underline" to="/dashboard?tab=profile">
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm flex gap-1 text-teal-500 my-5 ">
          <p>You must be signed in to comment </p>
          <Link className="text-blue-500 hover:underline" to="/sign-in">
            Sign in
          </Link>
        </div>
      )}
      {currentUser && (
        <form onSubmit={handleSubmit} className="border border-teal-500 rounded-md p-3">
          <Textarea
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setComment(e.target.value)
            }
            value={comment}
            placeholder="Add a comment"
            rows={3}
            maxLength={200}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-sm">
              {200 - comment.length} characters remaining
            </p>
            <Button type="submit" outline gradientDuoTone="purpleToBlue">
              Submit
            </Button>
          </div>
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-center text-gray-500 mt-5">No comments yet</p>
      ) : (
        <>
          <p className="my-5">
            Total Comments <span className="text-teal-500">{comments.length}</span>
          </p>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              currentUser={currentUser!}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </>
      )}
    </div>
  );
}
