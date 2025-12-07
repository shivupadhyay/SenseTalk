import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";
import toast from "react-hot-toast";

const initialState = {
  value: null,
  savedPosts: [],
};

export const fetchUser = createAsyncThunk("user/fetchUser", async (token) => {
  const { data } = await api.get("/api/user/data", {
    headers: { Authorization: `Bearer ${token}` },
  });
  // console.log(data, "Fetch User");
  return data.success ? data.user : null;
});

export const updateUser = createAsyncThunk(
  "user/update",
  async ({ userData, token }) => {
    const { data } = await api.post("/api/user/update", userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (data.success) {
      toast.success(data.message);
      return data.user;
    } else {
      toast.error(data.message);
      return null;
    }
  }
);

export const toggleSavePost = createAsyncThunk(
  "user/toggleSavePost",
  async ({ postId, token }) => {
    const { data } = await api.post(
      `/api/post/toggle-save`,
      { postId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { postId, saved: data.isSaved }; // saved = true/false from backend
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.value = action.payload;
        state.savedPosts = action.payload?.saved_posts || [];
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.value = action.payload;
      })
      .addCase(toggleSavePost.fulfilled, (state, action) => {
        const { postId, saved } = action.payload;

        if (saved) {
          if (!state.savedPosts.includes(postId)) {
            state.savedPosts.push(postId);
          }
        } else {
          state.savedPosts = state.savedPosts.filter((id) => id !== postId);
        }
      });
  },
});

export default userSlice.reducer;
