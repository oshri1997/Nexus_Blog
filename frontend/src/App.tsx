import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";

import Header from "./components/Header";
import FooterComponent from "./components/Footer";
import { ProtectedRouteGuest, ProtectedRouteUser } from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import Posts from "./pages/Posts";
import Search from "./pages/Search";

const App = () => {
  const { theme } = useSelector((state: RootState) => state.theme);
  const { currentUser } = useSelector((state: RootState) => state.user);
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastContainer pauseOnFocusLoss={false} theme={theme} />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/post/:slug" element={<PostPage />} />
        <Route path="/search" element={<Search />} />

        <Route element={<ProtectedRouteGuest currentUser={currentUser} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<ProtectedRouteGuest currentUser={currentUser} />}>
          <Route path="/create-post" element={<CreatePost />} />
        </Route>
        <Route element={<ProtectedRouteGuest currentUser={currentUser} />}>
          <Route path="/update-post/:postid" element={<UpdatePost />} />
        </Route>
        <Route path="/posts" element={<Posts />} />
        <Route element={<ProtectedRouteUser currentUser={currentUser} />}>
          <Route path="/sign-in" element={<SignIn />} />
        </Route>
        <Route element={<ProtectedRouteUser currentUser={currentUser} />}>
          <Route path="/sign-up" element={<SignUp />} />
        </Route>
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  );
};

export default App;
