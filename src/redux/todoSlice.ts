// todoSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dayjs } from "dayjs";

// Export the Todo type
export interface Todo {
  id: number;
  val: string;
  isDone: boolean;
  date: Dayjs | null;
}

// Define the initial state using the `Todo` type
interface TodoState {
  todos: Todo[];
}

const initialState: TodoState = {
  todos: [],
};

// Create a slice
const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
    editTodo: (
      state,
      action: PayloadAction<{ id: number; val: string; date: Dayjs | null }>
    ) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.val = action.payload.val;
        todo.date = action.payload.date;
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    toggleDone: (state, action: PayloadAction<number>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.isDone = !todo.isDone;
      }
    },
  },
});

// Export actions and reducer
export const { addTodo, editTodo, deleteTodo, toggleDone } = todoSlice.actions;
export default todoSlice.reducer;
