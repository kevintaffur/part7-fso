import { useState } from 'react';

const Blog = ({ blog, handleLike, deleteBlog, owner }) => {
  const [visible, setVisible] = useState(false);

  const addedByUser = () => {
    return blog.user.username === owner;
  };

  const removeBlog = () => {
    deleteBlog(blog.id, blog.title, blog.author);
  };

  if (visible) {
    return (
      <div className="blog">
        <div>
          {blog.title} <button onClick={() => setVisible(!visible)}>hide</button>
        </div>
        <div>
          {blog.url}
        </div>
        <div>
          likes {blog.likes} <button className="like-button" onClick={() => handleLike(blog.id)}>like</button>
        </div>
        <div>
          {blog.author}
        </div>
        {addedByUser() && (
          <div>
            <button onClick={removeBlog}>remove</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="blog">
      {blog.title} {blog.author} <button className="showData" onClick={() => setVisible(!visible)}>view</button>
    </div>
  );
};

export default Blog;