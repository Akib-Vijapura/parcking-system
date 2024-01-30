import { configureStore } from "@reduxjs/toolkit";
// import counter from "./reducers/counter";
import counterSlice from "./features/counterSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterSlice,
    },
  });
};
