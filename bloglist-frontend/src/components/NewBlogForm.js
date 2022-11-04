import { useState } from "react";
import { Button, Form } from "react-bootstrap";
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
      <Form onSubmit={addBlog}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Title"
            value={title}
            name="Title"
            id="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            placeholder="Author"
            value={author}
            name="Author"
            id="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Url</Form.Label>
          <Form.Control
            type="text"
            placeholder="Url"
            value={url}
            name="Url"
            id="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" id="create-button">
          Create
        </Button>
      </Form>
    </div>
  );
};

export default NewBlogForm;
