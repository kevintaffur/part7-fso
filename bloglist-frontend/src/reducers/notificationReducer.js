import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: null,
  type: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setMessage(state, action) {
      const message = action.payload;
      return { ...state, message };
    },
    removeMessage(state) {
      return { ...state, message: null };
    },
    setType(state, action) {
      const type = action.payload;
      return { ...state, type };
    },
    removeType(state) {
      return { ...state, type: null };
    },
  },
});

let timerId = null;
export const setNotification = (message, type, seconds) => {
  return async (dispatch) => {
    dispatch(setMessage(message));
    dispatch(setType(type));
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      dispatch(removeMessage());
      dispatch(removeType());
    }, seconds * 1000);
  };
};

export const { setMessage, removeMessage, setType, removeType } =
  notificationSlice.actions;
export default notificationSlice.reducer;
