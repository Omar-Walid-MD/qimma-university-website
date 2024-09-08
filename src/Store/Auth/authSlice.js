import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    loginID: null,
    loggedIn: false,
    loading: true,
}


export const getLoginID = createAsyncThunk(
    'auth/getLoginID',
    async () => {
      const loginID = localStorage.getItem("loginID");
      return loginID;
});

export const setLoginID = createAsyncThunk(
    'auth/setLoginID',
    async (loginID) => {
      localStorage.setItem("loginID",loginID);
      return loginID;
});

export const logOut = createAsyncThunk(
  'auth/logOut',
  async () => {
    localStorage.setItem("loginID","");
    return;
});

  
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder

      //getLoginID
      .addCase(getLoginID.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getLoginID.fulfilled, (state, action) => {
        state.loginID = action.payload || "";
        state.loggedIn = action.payload!==null;
        state.loading = false;
        console.log(action.payload);
      })
      .addCase(getLoginID.rejected, (state, action) => {
        state.loading = false;
      })

      //setLoginID
      .addCase(setLoginID.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(setLoginID.fulfilled, (state, action) => {
        state.loginID = action.payload || "";
        state.loggedIn = action.payload!==null;
        state.loading = false;
      })
      .addCase(setLoginID.rejected, (state, action) => {
        state.loading = false;
      })

      //logOut
      .addCase(logOut.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(logOut.fulfilled, (state, action) => {
        state.loginID = null;
        state.loggedIn = false;
        state.loading = false;
      })
      .addCase(logOut.rejected, (state, action) => {
        state.loading = false;
      })
      
    },
});

export default authSlice.reducer;