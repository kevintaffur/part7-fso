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
import { Link, Route, Routes, useMatch } from "react-router-dom";
import BlogList from "./components/BlogList";
import UserPosts from "./components/UserPosts";
import Blog from "./components/Blog";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const blogs = [...useSelector((state) => state.blogs)];
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);

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
      dispatch(setNotification("Wrong credentials", "error", 5));
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
    paddingRight: 5,
  };

  return (
    <div>
      <div>
        <Link style={padding} to="/">
          Blogs
        </Link>
        <Link style={padding} to="/users">
          Users
        </Link>
        {user ? (
          <>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </>
        ) : (
          <></>
        )}
      </div>
      {user ? <h2>Blogs</h2> : <h2>Log in to application</h2>}
      <Notification />
      {user ? (
        <>
          <div>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </div>
          <br />

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
                  owner={user}
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
