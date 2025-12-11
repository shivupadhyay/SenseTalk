import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  messages: [],
};

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async ({ token, userId }) => {
    const { data } = await api.post(
      "/api/message/get",
      { to_user_id: userId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data.success ? data : null;
  }
);
const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
    resetMessages: (state, action) => {
      state.messages = [];
    },
    deleteMessage: (state, action) => {
      const msgId = action.payload;
      const msg = state.messages.find((m) => m._id === msgId);
      if (msg) {
        msg.deleted = true; 
        msg.text = ""; 
      }
    },
    editMessage: (state, action) => {
      const { messageId, newText } = action.payload;
      const msg = state.messages.find((m) => m._id === messageId);
      if (msg) {
        msg.text = newText;
        msg.edited = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      if (action.payload) {
        state.messages = action.payload.messages;
      }
    });
  },
});

export const {
  setMessages,
  addMessage,
  resetMessages,
  deleteMessage,
  editMessage,
} = messagesSlice.actions;

export default messagesSlice.reducer;
