import { createSlice } from "@reduxjs/toolkit";

const initialTokens = {
  access_token: "",
  refresh_token: "",
};

const initialState = {
  uuid: null,
  email: "",
  username: "",
  tokens: initialTokens,
  itin: null,
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    _setUser: (state, action) => {
      const { uuid, email, tokens, itin, username } = action.payload;
      state.uuid = uuid;
      state.email = email;
      state.username = username;
      state.tokens = tokens;
      state.itin = itin;
    },

    _setTokens: (state, action) => {
      state.tokens = action.payload;
    },

    _logOut: (state) => {
      state.uuid = null;
      state.email = "";
      state.username = "";
      state.tokens = initialTokens;
    },
  },
});

export const { _setUser, _setTokens, _logOut } = user.actions;
export default user.reducer;
