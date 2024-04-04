import { RootState } from "../redux/store";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRoutePropsGuest {
  currentUser: RootState["user"]["currentUser"];
}

export function ProtectedRouteGuest({ currentUser }: ProtectedRoutePropsGuest) {
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}
export function ProtectedRouteUser({ currentUser }: ProtectedRoutePropsGuest) {
  return currentUser === null ? <Outlet /> : <Navigate to="/" />;
}
