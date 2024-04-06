import { useEffect } from "react";
import { RootState } from "../redux/store";
import { Navigate, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";

interface ProtectedRoutePropsGuest {
  currentUser: RootState["user"]["currentUser"];
}

export function ProtectedRouteGuest({ currentUser }: ProtectedRoutePropsGuest) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const validateUser = async () => {
      try {
        const response = await fetch("/api/auth/refresh-token");
        const data = await response.json();
        if (data.success === false) {
          dispatch(signoutSuccess());
          navigate("/sign-in");
        }
        if (searchParams.get("tab") !== "profile") {
          if (!data.user.isAdmin) {
            navigate("/dashboard?tab=profile");
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    validateUser();
  }, [searchParams]);
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}
export function ProtectedRouteUser({ currentUser }: ProtectedRoutePropsGuest) {
  return currentUser === null ? <Outlet /> : <Navigate to="/" />;
}
