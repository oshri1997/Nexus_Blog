import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import OverviewDash from "../components/OverviewDash";

export default function Dashboard() {
  const [tab, setTab] = useState<string>("");
  const [searchParams] = useSearchParams();
  useEffect(() => {
    // const urlParams = new URLSearchParams(location.search);//
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex !bg-background flex-col md:flex-row">
      <div>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profle content */}
      {tab === "profile" && <DashProfile />}
      {tab === "posts" && <DashPosts />}
      {tab === "users" && <DashUsers />}
      {tab === "comments" && <DashComments />}
      {tab === "overview" && <OverviewDash />}
    </div>
  );
}
