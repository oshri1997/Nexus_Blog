import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  Navbar,
  TextInput,
} from "flowbite-react";
import { Link } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function Header() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const path = useLocation().pathname;
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center  whitespace-nowrap text-white text-base sm:text-xl   px-2 py-1 rounded-lg   bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  font-semibold  dark:text-white"
      >
        Nexus Blog
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" pill color="gray">
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-2 md:order-last ">
        <Button className="hidden w-12 h-10 sm:inline" color="gray">
          <FaMoon />
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
            <Link to="/dashboard?tab=profle">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <DropdownDivider />
            <DropdownItem className="bg-red-500 hover:bg-red-700 text-white">
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

      <Navbar.Collapse className="">
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
        <Link to="/projects" className="cursor-pointer">
          <Navbar.Link active={path === "/projects"} as={"div"}>
            Projects
          </Navbar.Link>
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
