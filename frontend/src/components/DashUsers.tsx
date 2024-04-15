import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Button, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toastF } from "../helpers";
import { ILoggedInUser } from "../types";

/**
 * Represents a user.
 */

export default function DashUsers() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [users, setUsers] = useState<ILoggedInUser[]>([]);
  const [showMore, setShowMore] = useState<boolean>(true);
  const [userIdToDelete, setUserIdToDelete] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, [currentUser?._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers&start=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prevUsers: ILoggedInUser[]) => [...prevUsers, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        setUsers((prevUsers: ILoggedInUser[]) =>
          prevUsers.filter((user) => user._id !== userIdToDelete)
        );
      }
    } catch (error) {
      toastF("error", "An error occurred. Please try again later.");
    }
  };
  return (
    <div className=" w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700   ">
      {currentUser?.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Created Date</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y-2">
              {users.map((user: ILoggedInUser) => (
                <Table.Row key={user._id}>
                  <Table.Cell className="text-slate-800  dark:text-slate-400 font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="size-12 object-cover rounded-full bg-slate-600"
                    />
                  </Table.Cell>

                  <Table.Cell>{user.username}</Table.Cell>

                  <Table.Cell className="text-slate-800  dark:text-slate-400 font-medium">
                    {user.email}
                  </Table.Cell>
                  <Table.Cell className="text-slate-800  dark:text-slate-400 font-medium">
                    {user.isAdmin ? "Yes" : "No"}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
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
        <p>You have no users yet!</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="size-14 text=gray-400 mb-4 mx-auto dark:text-gray-200" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-300">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, delete this user.
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
