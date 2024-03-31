import { createSlice } from "@reduxjs/toolkit";

const initialState= {
    currentUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        loginInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
})

export const { loginInStart, loginInSuccess, loginInFailure } = userSlice.actions

export default userSlice.reducer;