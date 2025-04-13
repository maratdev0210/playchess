// keep the state of two players
// store player's id's and their usernames

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

interface Player {
  id: number;
  username: string;
}

export interface PlayersState {
  inviter: Player | null; // player who has invited the other one for a game
  invited: Player | null; // player who has got invited for a game by the other player
}

const initialState: PlayersState = {
  inviter: null,
  invited: null,
};

export const playersSlice = createSlice({
  name: "players",
  initialState,
  reducers: {
    setInviterPlayerData: (state, action: PayloadAction<Player>) => {
      state.inviter = action.payload;
    },

    setInvitedPlayerData: (state, action: PayloadAction<Player>) => {
      state.invited = action.payload;
    },
  },
});

export const { setInviterPlayerData, setInvitedPlayerData } =
  playersSlice.actions;

export const selectPlayersData = (state: RootState) => state.players;

export default playersSlice.reducer;
