import { ListGroup } from "react-bootstrap";
import Blog from "./Blog";
import NewBlogForm from "./NewBlogForm";
import Togglable from "./Togglable";

const BlogList = ({ blogs, user, handleDelete, handleLike }) => {
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
    <>
      <Togglable buttonLabel="New Blog">
        <NewBlogForm />
      </Togglable>
      <br />
      <div className="container">
        <ListGroup>
          {blogs.sort(sortByLikes).map((blog) => (
            <ListGroup.Item key={blog.id}>
              <Blog
                blog={blog}
                handleLike={handleLike}
                deleteBlog={handleDelete}
                owner={user.username}
                show="line"
              />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </>
  );
};

export default BlogList;
