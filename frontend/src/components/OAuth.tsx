import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { signInSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toastF } from "../helpers";
export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //handleGoogleClick function to handle google sign in
  const handleGoogleClick = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      console.log(resultsFromGoogle);
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toastF("Signed in successfully!", "success");
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      toastF("Something went wrong. Please try again.", "error");
    }
  };
  return (
    <Button type="button" gradientDuoTone="pinkToOrange" onClick={handleGoogleClick} outline>
      <AiFillGoogleCircle className="size-6 mr-2" /> Sign In with Google
    </Button>
  );
}
