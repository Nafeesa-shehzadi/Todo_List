import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./redux/todoSlice"; // Import your todo slice

export const store = configureStore({
  reducer: {
    todos: todoReducer, // Add your reducers here
  },
});

// Define the root state and dispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
