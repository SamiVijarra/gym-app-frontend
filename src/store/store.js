import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
    },
    middleware: (getDefaultMiddlewere) => getDefaultMiddlewere ({
        serializableCheck: false
    })
})