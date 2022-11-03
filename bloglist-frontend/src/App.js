import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import NewBlogForm from "./components/NewBlogForm";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "./reducers/notificationReducer";
import {
  deleteBlog,
  initializeBlogs,
  updateBlog,
} from "./reducers/blogReducer";

const App = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const blogs = [...useSelector((state) => state.blogs)];

  useEffect(() => {
    if (user !== null) {
      dispatch(initializeBlogs());
    }
  }, [user]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      dispatch(setNotification("Login successful", "success", 5));
    } catch (exception) {
      dispatch(setNotification("Wrong credentials", "error", 5));
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    setUser(null);
    blogService.setToken(null);
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

  const sortByLikes = (blog1, blog2) => {
    if (blog1.likes > blog2.likes) {
      return -1;
    }
    if (blog1.likes < blog2.likes) {
      return 1;
    }
    return 0;
  };

  return (
    <div>
      {user ? <h2>Blogs</h2> : <h2>Log in to application</h2>}
      <Notification />
      {user ? (
        <>
          <div>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </div>
          <br />
          <Togglable buttonLabel="New blog">
            <NewBlogForm />
          </Togglable>
          <br />
          <div className="blogs">
            {blogs.sort(sortByLikes).map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                handleLike={handleLike}
                deleteBlog={handleDelete}
                owner={user.username}
              />
            ))}
          </div>
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
