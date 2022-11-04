import { useState } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { commentBlog } from "../reducers/blogReducer";

const Blog = ({ blog, handleLike, deleteBlog, owner, show }) => {
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();

  const addedByUser = () => {
    return blog.user.username === owner;
  };

  const removeBlog = () => {
    deleteBlog(blog.id, blog.title, blog.author);
  };

  if (!blog) {
    return null;
  }

  if (show === "line") {
    return (
      <div>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
      </div>
    );
  }

  const randomNumber = () => {
    return Math.floor(Math.random() * 100000000);
  };

  const handleComment = async (event) => {
    event.preventDefault();
    dispatch(commentBlog(blog.id, comment));
    setComment("");
  };

  return (
    <div className="container">
      <h2>{blog.title}</h2>
      <div>{blog.url}</div>
      <div>
        {blog.likes} likes{" "}
        <Button
          variant="secondary"
          size="sm"
          className="like-button"
          onClick={() => handleLike(blog.id)}
        >
          like
        </Button>
      </div>
      <div>added by {blog.user.name}</div>
      {addedByUser() && (
        <div>
          <Button variant="danger" size="sm" onClick={removeBlog}>
            remove
          </Button>
        </div>
      )}
      <h3>Comments</h3>
      <Form onSubmit={handleComment}>
        <Form.Group>
          <Form.Control
            type="text"
            value={comment}
            placeholder="Comment"
            onChange={({ target }) => setComment(target.value)}
          />
          <Button variant="primary" size="sm" type="submit">
            add comment
          </Button>
        </Form.Group>
      </Form>
      <br />
      <ListGroup>
        {blog.comments.map((comment) => (
          <ListGroup.Item key={`${comment}${randomNumber()}`}>
            {comment}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Blog;
