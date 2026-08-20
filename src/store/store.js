import { configureStore } from "@reduxjs/toolkit";
import { authSlice, usersSlice } from "./";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        users: usersSlice.reducer
    },
    middleware: (getDefaultMiddlewere) => getDefaultMiddlewere ({
        serializableCheck: false
    })
})