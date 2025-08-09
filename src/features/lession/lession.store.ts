import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Lession from "../../models/lession";

interface LessionState {
  selectedLession?: Lession;
}

const initialState: LessionState = {
  selectedLession: undefined,
};

export const lessionSlice = createSlice({
  name: "lession",
  initialState,
  reducers: {
    setSelectedLession: (state, action: PayloadAction<Lession>) => {
      state.selectedLession = action.payload;
    },
    clearSelectedLession: (state) => {
      state.selectedLession = undefined;
    },
  },
});

export const { setSelectedLession, clearSelectedLession } = lessionSlice.actions;
export default lessionSlice.reducer;
