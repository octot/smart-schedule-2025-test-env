import { createSlice } from "@reduxjs/toolkit";

const scheduleSlice = createSlice({
  name: "schedule",
  initialState: [],
  reducers: {
    addSession: (state, action) => {
      state.push(action.payload);
    },
  },
});
console.log("scheduleSlice", scheduleSlice);
export const { addSession } = scheduleSlice.actions;
export default scheduleSlice.reducer;
