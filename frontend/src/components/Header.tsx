import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  Navbar,
  TextInput,
} from "flowbite-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { RootState } from "../redux/store";
import { toggleTheme } from "../redux/theme/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { toastF } from "../helpers";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";

export default function Header() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { theme } = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const path = useLocation().pathname;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const searchTermFromUrl = searchParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [searchParams]);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchParams.set("searchTerm", searchTerm);
    navigate(`/search?searchTerm=${searchTerm}`);
  };
  return (
    <Navbar className="border-b-2 !bg-backgroundSecondary">
      <Link
        to="/"
        className="self-center  whitespace-nowrap text-white text-base sm:text-xl   px-2 py-1 rounded-lg   bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  font-semibold  dark:text-white"
      >
        Dev Lab
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" pill color="gray">
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-2 md:order-last ">
        <Button
          onClick={() => dispatch(toggleTheme())}
          className="hidden w-12 h-10 sm:inline"
          color="gray"
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        {currentUser ? (
          <Dropdown
            inline
            label={<Avatar rounded alt="user" img={currentUser.profilePicture} />}
            arrowIcon={false}
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <DropdownDivider />
            <DropdownItem
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-700 text-white"
            >
              Sign Out
            </DropdownItem>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Link className="cursor-pointer" to="/">
          <Navbar.Link active={path === "/"} as={"div"}>
            Home
          </Navbar.Link>
        </Link>
        <Link to="/about" className="cursor-pointer">
          <Navbar.Link active={path === "/about"} as={"div"}>
            About
          </Navbar.Link>
        </Link>
        <Link to="/posts" className="cursor-pointer">
          <Navbar.Link active={path === "/projects"} as={"div"}>
            Posts
          </Navbar.Link>
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
