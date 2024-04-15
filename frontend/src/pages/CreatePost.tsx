// import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { toastF } from "../helpers";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { IFormPost } from "../types";

export default function CreatePost() {
  const [file, setFile] = useState<File | null>(null);
  const [imageFileProgress, setImageFileProgress] = useState<number>(0);
  const [formData, setFormData] = useState<IFormPost | null>(null);
  const navigate = useNavigate();
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
  };
  const handleSubmitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData?.title || !formData?.content)
      return toastF("Please fill in the form", "error");
    try {
      const response = await fetch("api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        return toastF("Could not create post, please try again", "error");
      }
      const data = await response.json();
      toastF("Post created successfully", "success");
      setFormData(null);
      navigate(`/post/${data.slug}`);
    } catch (error) {
      toastF("Could not create post, please try again", "error");
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form onSubmit={handleSubmitPost} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between ">
          <TextInput
            onChange={handleChangeInput}
            className="flex-1"
            required
            id="title"
            type="text"
            placeholder="Title"
          />
          <Select id="category" value={formData?.category} onChange={handleChangeInput}>
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
          <img className="h-72 w-full object-cover" src={formData.image} alt="postImage" />
        )}
        <ReactQuill
          onChange={(content) => setFormData({ ...formData!, content })}
          className="h-72 mb-12"
          theme="snow"
          placeholder="Write here!"
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
    </div>
  );
}
