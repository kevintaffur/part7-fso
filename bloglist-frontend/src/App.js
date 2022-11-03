import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import NewBlogForm from "./components/NewBlogForm";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import { useDispatch } from "react-redux";
import { setNotification } from "./reducers/notificationReducer";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (user !== null) {
      blogService.getAll().then((blogs) => setBlogs(blogs));
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

  const addBlog = async (newObject) => {
    try {
      const newBlog = await blogService.create(newObject);
      setBlogs(blogs.concat(newBlog));
      dispatch(
        setNotification(
          `A new blog "${newBlog.title}" by ${newBlog.author} added`,
          "success",
          5
        )
      );
    } catch (exception) {
      dispatch(setNotification("Error adding new blog", "error", 5));
    }
  };

  const handleLike = async (id) => {
    const blog = blogs.find((blog) => blog.id === id);
    const changedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };

    try {
      const updatedBlog = await blogService.update(changedBlog, id);
      setBlogs(blogs.map((blog) => (blog.id !== id ? blog : updatedBlog)));
    } catch (exception) {
      dispatch(setNotification("Error updating blog", "error", 5));
    }
  };

  const deleteBlog = async (id, title, author) => {
    if (window.confirm(`Remove blog "${title}" by ${author}`)) {
      try {
        await blogService.remove(id);
        setBlogs(blogs.filter((blog) => blog.id !== id));
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
            <NewBlogForm createBlog={addBlog} />
          </Togglable>
          <br />
          <div className="blogs">
            {blogs.sort(sortByLikes).map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                handleLike={handleLike}
                deleteBlog={deleteBlog}
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
