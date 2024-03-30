import { Button, Label, TextInput, Spinner } from "flowbite-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";
import { RootState } from "../redux/store";
import OAuth from "../components/OAuth";
import { toastF } from "../helpers";

interface User {
  email: string;
  password: string;
}

export default function SignIn() {
  const [formData, setFormData] = useState<User>({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const loading = useSelector((state: RootState) => state.user.loading);

  if (currentUser) {
    return <Navigate to="/" />;
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value.trim() });
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.email || !formData.password) {
      return toastF("Please fill all the fields", "info");
    }
    try {
      dispatch(signInStart());
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === false) {
        dispatch(signInFailure());
        return toastF(data.message, "error");
      }
      if (response.ok) {
        dispatch(signInSuccess(data));
        toastF("Signed in successfully!", "success");
        navigate("/");
      }
    } catch (error) {
      signInFailure();
      toastF("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 gap-5 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
        <div className="flex-1">
          {/* left side */}
          <Link
            to="/"
            className="text-white text-4xl px-2 py-1 rounded-lg  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  font-bold  dark:text-white"
          >
            Nexus Blog
          </Link>
          <p className="mt-5">
            This is a blog where you can share your thoughts and ideas with the world.
          </p>
        </div>
        {/* right side */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label value="Your Email" />
              <TextInput
                type="text"
                placeholder="name@comapany.com"
                id="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Password" />
              <TextInput
                type="password"
                placeholder="*********"
                id="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner color="purple" size="sm" className="ml-2" />{" "}
                  <span className="pl-2">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
