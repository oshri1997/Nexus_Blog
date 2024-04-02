import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRouteAdmin() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  return currentUser?.isAdmin ? <Outlet /> : <Navigate to="/" />;
}
