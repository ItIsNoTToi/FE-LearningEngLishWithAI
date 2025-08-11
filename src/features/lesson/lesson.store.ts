import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Lesson from "../../models/lesson";

interface LessonState {
  selectedLesson?: Lesson;
}

const initialState: LessonState = {
  selectedLesson: undefined,
};

export const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {
    setSelectedLesson: (state, action: PayloadAction<Lesson>) => {
      state.selectedLesson = action.payload;
    },
    clearSelectedLesson: (state) => {
      state.selectedLesson = undefined;
    },
  },
});

export const { setSelectedLesson, clearSelectedLesson } = lessonSlice.actions;
export default lessonSlice.reducer;
