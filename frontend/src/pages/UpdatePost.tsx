// import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { toastF } from "../helpers";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
interface FormData {
  title: string;
  content: string;
  category?: string;
  image?: string;
}

export default function UpdatePost() {
  const [file, setFile] = useState<File | null>(null);
  const [imageFileProgress, setImageFileProgress] = useState<number>(0);
  const [formData, setFormData] = useState<FormData | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.user);

  const { postid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postid=${postid}`);
        if (!res.ok) {
          return toastF("Could not fetch post, please try again", "error");
        }
        const data = await res.json();
        setFormData(data.posts[0]);
        console.log(formData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, []);

  const hanleUploadImage = async () => {
    try {
      if (!file) return toastF("Please select an image", "error");
      if (file.size > 2 * 1024 * 1024)
        return toastF("Image size should be less than 2MB", "error");
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file!.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file!);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileProgress(Number(progress.toFixed(0)));
        },
        () => {
          toastF("Could not upload image, please try again.", "error");
          setImageFileProgress(0);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileProgress(0);
            setFormData({ ...formData!, image: downloadURL });
            toastF("Image uploaded successfully", "success");
          });
        }
      );
    } catch (error) {
      toastF("Could not upload image, please try again.", "error");
      setImageFileProgress(0);
    }
  };
  const handleChangeInput = (e: any) => {
    setFormData({ ...formData!, [e.target.id]: e.target.value });
    console.log(formData);
  };
  const handleSubmitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/post/updatepost/${postid}/${currentUser?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        return toastF("Could not update this post, please try again", "error");
      }
      const data = await response.json();

      toastF("Post updated successfully", "success");
      setFormData(null);
      navigate(`/post/${data.slug}`);
    } catch (error) {
      toastF("Could not update this post, please try again", "error");
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Upadte post</h1>
      <form onSubmit={handleSubmitPost} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between ">
          <TextInput
            onChange={handleChangeInput}
            className="flex-1"
            required
            id="title"
            type="text"
            placeholder="Title"
            value={formData ? formData.title : ""}
          />
          <Select
            id="category"
            value={formData ? formData?.category : ""}
            onChange={handleChangeInput}
          >
            <option value="uncategorized">Select a catergory</option>
            <option value="react">React</option>
            <option value="vue">Vue</option>
            <option value="angular">Angular</option>
            <option value="next">Next</option>
            <option value="javascript">Javascript</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            onChange={(e) => setFile(e.target.files![0])}
            itemType="file"
            accept="image/*"
          />
          <Button
            onClick={hanleUploadImage}
            type="button"
            size="sm"
            gradientDuoTone="purpleToBlue"
            outline
            disabled={imageFileProgress > 0}
          >
            {imageFileProgress === 0 ? (
              "Upload Image"
            ) : (
              <div className="size-16">
                <CircularProgressbar
                  value={imageFileProgress}
                  text={`${imageFileProgress}%`}
                />
              </div>
            )}
          </Button>
        </div>
        {formData?.image && (
          <img className="h-72 w-full object-cover" src={formData?.image} alt="postImage" />
        )}
        <ReactQuill
          id="content"
          value={formData ? formData?.content : ""}
          onChange={(content) => setFormData({ ...formData!, content })}
          className="h-72 mb-12"
          theme="snow"
          placeholder="Write here!"
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update Post
        </Button>
      </form>
    </div>
  );
}
