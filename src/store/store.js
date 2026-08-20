import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth/authSlice";
import { usersSlice } from "./users/usersSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        users: usersSlice.reducer
    },
    middleware: (getDefaultMiddlewere) => getDefaultMiddlewere ({
        serializableCheck: false
    })
})