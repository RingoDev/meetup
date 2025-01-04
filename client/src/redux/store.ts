import { configureStore } from "@reduxjs/toolkit";
import socketMiddleware from "./socket/middleware";
import userReducer from "./user/user.reducer";

const store = configureStore({
  reducer: userReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware),
});

export default store;
