import { configureStore } from "@reduxjs/toolkit";
import sessionSliceReducer from "./features/session/sessionSlice";
import playersSliceReducer from "./features/players/playersSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      session: sessionSliceReducer,
      players: playersSliceReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
