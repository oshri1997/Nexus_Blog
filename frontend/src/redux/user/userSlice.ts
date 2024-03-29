import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  email: string;
  username: string;
  profilePicture: string;
}

interface authState {
  currentUser: User | null;
  loading: boolean;
}

const initialState: authState = {
  currentUser: null,
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action: PayloadAction<object>) => {
      state.currentUser = action.payload as User;
      state.loading = false;
    },
    signInFailure: (state) => {
      state.loading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;

export default userSlice.reducer;
