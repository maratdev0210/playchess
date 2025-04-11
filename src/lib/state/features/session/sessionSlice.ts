import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

export interface SessionState {
  id: number | null;
}

const initialState: SessionState = {
  id: null,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSessionData: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
    },
  },
});

export const { setSessionData } = sessionSlice.actions;

export const selectSessionData = (state: RootState) => state.session.id;

export default sessionSlice.reducer;
