import { useState } from "react";
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
      <div className="blog">
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
    <div className="blog">
      <h2>{blog.title}</h2>
      <div>{blog.url}</div>
      <div>
        {blog.likes} likes{" "}
        <button className="like-button" onClick={() => handleLike(blog.id)}>
          like
        </button>
      </div>
      <div>added by {blog.author}</div>
      {addedByUser() && (
        <div>
          <button onClick={removeBlog}>remove</button>
        </div>
      )}
      <h3>Comments</h3>
      <form onSubmit={handleComment}>
        <input
          type="text"
          value={comment}
          placeholder="Comment"
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment) => (
          <li key={`${comment}${randomNumber()}`}>{comment}</li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
