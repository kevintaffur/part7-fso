import { useState } from "react";
import { useDispatch } from "react-redux";
import { createBlog } from "../reducers/blogReducer";
import { setNotification } from "../reducers/notificationReducer";

const NewBlogForm = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const dispatch = useDispatch();

  const addBlog = (event) => {
    event.preventDefault();

    dispatch(
      createBlog({
        title,
        author,
        url,
      })
    );

    try {
      dispatch(
        setNotification(
          `A new blog "${title}" by ${author} added`,
          "success",
          5
        )
      );
    } catch (exception) {
      dispatch(setNotification("Error adding new blog", "error", 5));
    }

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:{" "}
          <input
            type="text"
            value={title}
            name="Title"
            placeholder="Title"
            id="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:{" "}
          <input
            type="text"
            value={author}
            name="Author"
            placeholder="Author"
            id="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:{" "}
          <input
            type="text"
            value={url}
            name="Url"
            placeholder="Url"
            id="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit" id="create-button">
          create
        </button>
      </form>
    </div>
  );
};

export default NewBlogForm;
