import { useState, useEffect } from "react";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "./reducers/notificationReducer";
import {
  deleteBlog,
  initializeBlogs,
  updateBlog,
} from "./reducers/blogReducer";
import { resetUser, setUser } from "./reducers/userReducer";
import { initializeUsers } from "./reducers/usersReducer";
import UserList from "./components/UserList";
import { Link, Route, Routes, useMatch, useNavigate } from "react-router-dom";
import BlogList from "./components/BlogList";
import UserPosts from "./components/UserPosts";
import Blog from "./components/Blog";
import { Button, Container, Nav, Navbar } from "react-bootstrap";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const blogs = [...useSelector((state) => state.blogs)];
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null) {
      dispatch(initializeBlogs());
      dispatch(initializeUsers());
    }
  }, [user]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      dispatch(setUser(JSON.parse(loggedUserJSON)));
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      dispatch(setUser(user));
      setUsername("");
      setPassword("");
      dispatch(setNotification("Login successful", "success", 5));
    } catch (exception) {
      dispatch(setNotification("Wrong credentials", "danger", 5));
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    dispatch(resetUser());
    dispatch(setNotification("Logout successful", "success", 5));
  };

  const handleLike = async (id) => {
    const blog = blogs.find((blog) => blog.id === id);
    const changedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };

    try {
      dispatch(updateBlog(changedBlog));
    } catch (exception) {
      dispatch(setNotification("Error updating blog", "error", 5));
    }
  };

  const handleDelete = async (id, title, author) => {
    if (window.confirm(`Remove blog "${title}" by ${author}`)) {
      try {
        dispatch(deleteBlog(id));
        dispatch(
          setNotification(`Blog "${title}" by ${author} deleted`, "success", 5)
        );
        navigate("/");
      } catch (exception) {
        dispatch(setNotification("Error deleting blog", "error", 5));
      }
    }
  };

  const matchUser = useMatch("/users/:id");
  const matchedUser = matchUser
    ? users.find((user) => user.id === matchUser.params.id)
    : null;

  const matchBlog = useMatch("/blogs/:id");
  const matchedBlog = matchBlog
    ? blogs.find((blog) => blog.id === matchBlog.params.id)
    : null;

  const padding = {
    paddingRight: 20,
  };

  return (
    <div className="container">
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand>
            <Link to="/">Blogs</Link>
          </Navbar.Brand>
          <Nav>
            <Link style={padding} to="/users">
              Users
            </Link>
            <div>
              {user ? (
                <>
                  {user.name} logged in{" "}
                  <Button variant="primary" size="sm" onClick={handleLogout}>
                    logout
                  </Button>
                </>
              ) : (
                <></>
              )}
            </div>
          </Nav>
        </Container>
      </Navbar>

      {user ? <h2>Blogs</h2> : <h2>Log in to application</h2>}
      <Notification />
      {user ? (
        <>
          <Routes>
            <Route path="/users" element={<UserList users={users} />} />
            <Route
              path="/"
              element={
                <BlogList
                  blogs={blogs}
                  user={user}
                  handleDelete={handleDelete}
                  handleLike={handleLike}
                />
              }
            />
            <Route
              path="/users/:id"
              element={<UserPosts user={matchedUser} show="info" />}
            />
            <Route
              path="/blogs/:id"
              element={
                <Blog
                  blog={matchedBlog}
                  handleLike={handleLike}
                  deleteBlog={handleDelete}
                  owner={user.username}
                />
              }
            />
          </Routes>
        </>
      ) : (
        <LoginForm
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      )}
    </div>
  );
};

export default App;
