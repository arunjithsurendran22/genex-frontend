"use client"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  selectedBatches: string[];
  workerWallets: string[];
  processStart: boolean;
};

const initialState: InitialState = {
  selectedBatches: [],
  workerWallets: [],
  processStart: false,
};

const batchSlice = createSlice({
  name: "batch",
  initialState,
  reducers: {
    addBatch: (state, action: PayloadAction<string>) => {
      if (!state.selectedBatches.includes(action.payload)) {
        state.selectedBatches.push(action.payload);
      }
    },
    addWorkerWallet: (state, action: PayloadAction<string>) => {
      if (!state.workerWallets.includes(action.payload)) {
        state.workerWallets.push(action.payload);
      }
    },
    removeWorkerWallet: (state, action: PayloadAction<string>) => {
      state.workerWallets = state.workerWallets.filter(
        (ww) => ww !== action.payload
      );
    },
    removeBatch: (state, action: PayloadAction<string>) => {
      state.selectedBatches = state.selectedBatches.filter(
        (batch) => batch !== action.payload
      );
    },
    processStarting: (state, action: PayloadAction<boolean>) => {
      state.processStart = action.payload;
    },
  },
});

export const {
  addBatch,
  removeBatch,
  processStarting,
  addWorkerWallet,
  removeWorkerWallet,
} = batchSlice.actions;

export default batchSlice.reducer;
