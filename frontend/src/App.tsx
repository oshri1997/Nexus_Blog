import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Header from "./components/Header";
import FooterComponent from "./components/Footer";
import { ProtectedRouteGuest, ProtectedRouteUser } from "./components/ProtectedRoute";
import ProtectedRouteAdmin from "./components/ProtectedRouteAdmin";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import CreatePost from "./pages/CreatePost";

const App = () => {
  const { theme } = useSelector((state: RootState) => state.theme);
  const { currentUser } = useSelector((state: RootState) => state.user);
  return (
    <BrowserRouter>
      <ToastContainer theme={theme} />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route element={<ProtectedRouteGuest currentUser={currentUser} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<ProtectedRouteUser currentUser={currentUser} />}>
          <Route path="/sign-in" element={<SignIn />} />
        </Route>
        <Route element={<ProtectedRouteUser currentUser={currentUser} />}>
          <Route path="/sign-up" element={<SignUp />} />
        </Route>
        <Route element={<ProtectedRouteAdmin />}>
          <Route path="/create-post" element={<CreatePost />} />
        </Route>

        <Route path="/projects" element={<Projects />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  );
};

export default App;
