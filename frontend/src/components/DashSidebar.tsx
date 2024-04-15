import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiDocumentText,
  HiUser,
  HiUserGroup,
} from "react-icons/hi";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import { toastF } from "../helpers";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { BiSolidCommentDetail } from "react-icons/bi";

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [tab, setTab] = useState<string>("");
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  // handleSignOut function
  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        return toastF(data.message, "error");
      }
      dispatch(signoutSuccess());
      toastF("Sign out successfuly", "info");
    } catch (error) {
      toastF("Something went worng...", "error");
    }
  };

  return (
    <Sidebar className="md:w-56 w-full">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser?.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser?.isAdmin && (
            <>
              <Link to="/dashboard?tab=overview">
                <Sidebar.Item
                  active={tab === "overview"}
                  icon={HiChartPie}
                  labelColor="dark"
                  as="div"
                >
                  Overview
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=users">
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiUserGroup}
                  labelColor="dark"
                  as="div"
                >
                  Users
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=posts">
                <Sidebar.Item
                  active={tab === "posts"}
                  icon={HiDocumentText}
                  labelColor="dark"
                  as="div"
                >
                  Posts
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=comments">
                <Sidebar.Item
                  active={tab === "comments"}
                  icon={BiSolidCommentDetail}
                  labelColor="dark"
                  as="div"
                >
                  Comments
                </Sidebar.Item>
              </Link>
            </>
          )}
          <Sidebar.Item
            onClick={handleSignOut}
            icon={HiArrowSmRight}
            className="cursor-pointer"
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
