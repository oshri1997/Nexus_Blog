import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Button, Modal, TextInput, Spinner } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../redux/user/userSlice";
import { toastF } from "../helpers";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

interface FormData {
  username?: string;
  email?: string;
  password?: string;
  profilePicture?: string;
}

export default function DashProfile() {
  const { currentUser, loading } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageFileProgress, setImageFileProgress] = useState<number>(0);
  const [imageFileUploading, setImageFileUploading] = useState<boolean>(false); //
  const [formData, setFormData] = useState<FormData | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate = useNavigate();

  //handleImageChange function to handle image change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file?.type.startsWith("image") && file.size < 2 * 1024 * 1024) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    } else {
      toastF("Could not upload image (max size 2MB)", "error");
    }
  };
  //uploadImage function to upload image to firebase storage
  const uploadImage = async () => {
    setImageFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile?.name!;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile!);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileProgress(Number(progress.toFixed(0)));
      },
      () => {
        toastF("Could not upload image, please try again.", "error");
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  //handleChange function to handle change in form
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };
  //handleSubmit function to handle submit in form
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData) return toastF("Please fill in the form.", "info");
    if (imageFileUploading) return toastF("Please wait until the image is uploaded.", "info");
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        toastF("Something went wrong. Please try again.", "error");
        return dispatch(updateFailure());
      }
      dispatch(updateSuccess(data));
      toastF("Profile updated successfully!.", "success");
      setFormData(null);
    } catch (error) {
      toastF("Something went wrong. Please try again.", "error");
      dispatch(updateFailure());
    }
  };
  //handleDeleteUser function to handle delete user
  const handleDeleteUser = async () => {
    dispatch(deleteUserStart());
    try {
      const res = await fetch(`/api/user/delete/${currentUser?._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        dispatch(deleteUserFailure());
        toastF("Something went wrong. Please try again.", "error");
        return;
      }
      toastF("Account deleted successfully.", "success");
      dispatch(deleteUserSuccess());
      navigate("/sign-in");
    } catch (error) {
      dispatch(deleteUserFailure());
      toastF("Something went wrong. Please try again.", "error");
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
        <input
          ref={fileRef}
          className="hidden"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <div
          className="size-32 relative self-center cursor-pointer dark:shadow-gray-500 shadow-md overflow-hidden rounded-full"
          onClick={() => fileRef.current?.click()}
        >
          {imageFileProgress > 0 && (
            <CircularProgressbar
              strokeWidth={2}
              value={imageFileProgress || 0}
              text={`${imageFileProgress}%`}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  display: `${imageFileProgress >= 100 && "none"}`,
                },
                path: { stroke: `rgb(62,152,199),${imageFileProgress}/100` },
              }}
            />
          )}
          <img
            className={`rounded-full h-full object-cover w-full border-[6px] border-[lightgray] ${
              imageFileProgress && imageFileProgress < 100 && "opacity-60"
            } `}
            src={imageFileUrl || currentUser?.profilePicture}
            alt="profilePicture"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser?.username}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          id="email"
          placeholder="email"
          defaultValue={currentUser?.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />

        <Button
          disabled={loading || imageFileUploading}
          gradientDuoTone="purpleToBlue"
          outline
          type="submit"
        >
          {loading ? (
            <>
              <span>loading...</span>
              <Spinner className="mr-2" />
            </>
          ) : (
            "Update"
          )}
        </Button>

        {currentUser?.isAdmin && (
          <Link to="/create-post">
            <Button className="w-full" gradientDuoTone="purpleToBlue" type="button">
              Create a post
            </Button>
          </Link>
        )}
        {/* {updateUserSuccess && <Alert color="success">Profile updated successfully.</Alert>} */}
      </form>
      <div className="text-red-500 mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account
        </span>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="size-14 text=gray-400 mb-4 mx-auto dark:text-gray-200" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-300">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, delete my account!
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
