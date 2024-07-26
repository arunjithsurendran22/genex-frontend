import { configureStore } from "@reduxjs/toolkit";
import batchReducer from "../redux/features/batchbuy";

const store = configureStore({
  reducer: {
    batch: batchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
