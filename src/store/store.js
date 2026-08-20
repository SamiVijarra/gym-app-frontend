import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth/authSlice";
import { usersSlice } from "./users/usersSlice";
import { exercisesSlice } from "./exercises/exercisesSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        users: usersSlice.reducer,
        exercises: exercisesSlice.reducer,
    },
    middleware: (getDefaultMiddlewere) => getDefaultMiddlewere ({
        serializableCheck: false
    })
})