import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const initialState = null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser(state, action) {
      return action.payload;
    },
    removeUser() {
      return null;
    },
  },
});

export const setUser = (user) => {
  return async (dispatch) => {
    dispatch(addUser(user));
    blogService.setToken(user.token);
  };
};

export const resetUser = () => {
  return async (dispatch) => {
    dispatch(removeUser());
    blogService.setToken(null);
  };
};

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
