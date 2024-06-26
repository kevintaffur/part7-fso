import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const initialState = [];

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      return [...state, action.payload];
    },
    changeBlog(state, action) {
      const changedBlog = action.payload;
      const id = changedBlog.id;
      return state.map((blog) => {
        return blog.id === id ? changedBlog : blog;
      });
    },
    removeBlog(state, action) {
      const id = action.payload;
      return state.filter((blog) => {
        return blog.id !== id;
      });
    },
    addComment(state, action) {
      const { id, comment } = action.payload;
      const blog = state.find((blog) => blog.id === id);
      const commentedBlog = {
        ...blog,
        comments: [...blog.comments, comment],
      };
      return state.map((blog) => (blog.id === id ? commentedBlog : blog));
    },
  },
});

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (newObject) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(newObject);
    dispatch(appendBlog(newBlog));
  };
};

export const updateBlog = (newObject) => {
  return async (dispatch) => {
    const id = newObject.id;
    const updatedBlog = await blogService.update(newObject, id);
    dispatch(changeBlog(updatedBlog));
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id);
    dispatch(removeBlog(id));
  };
};

export const commentBlog = (id, comment) => {
  return async (dispatch) => {
    await blogService.comment(id, comment);
    dispatch(addComment({ id, comment }));
  };
};

export const { setBlogs, appendBlog, changeBlog, removeBlog, addComment } =
  blogSlice.actions;

export default blogSlice.reducer;
