import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Alert, Button, TextInput } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

export default function DashProfile() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageFileProgress, setImageFileProgress] = useState<number>(0);
  const [imageFileError, setImageFileError] = useState<string | null>(null);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImageFileError("");
    if (file?.type.startsWith("image") && file.size < 2 * 1024 * 1024) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    } else {
      setImageFileError("Could not upload image (max size 2MB)");
    }
  };
  const uploadImage = async () => {
    // service firebase.storage {
    //     match /b/{bucket}/o {
    //       match /{allPaths=**} {
    //         allow read;
    //         allow write : if
    //         request.resource.size<2*1024*1024 &&
    //         request.resource.contentType.matches('image/.*');
    //       }
    //     }
    //   }
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
        // error
        setImageFileError("Could not upload image (max size 2MB)");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
        });
      }
    );
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4 ">
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
        {imageFileError && <Alert color="failure">{imageFileError}</Alert>}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser?.username}
        />
        <TextInput
          type="text"
          id="email"
          placeholder="email"
          defaultValue={currentUser?.email}
        />
        <TextInput type="password" id="password" placeholder="password" />
        <Button gradientDuoTone="purpleToBlue" outline type="submit">
          Update
        </Button>
      </form>
      <div className="text-red-500 mt-5">
        <span className="cursor-pointer">Delete Account</span>
      </div>
    </div>
  );
}
