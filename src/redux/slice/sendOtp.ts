import { createSlice, SerializedError } from "@reduxjs/toolkit";
import { sendOtpThunk } from "../thunk/sendOtpThunk";
import toast from "react-hot-toast";
interface InitialState {
  loading: boolean;
  success: boolean;
  error: null | SerializedError;
}
const initialState: InitialState = {
  success: false,
  loading: false,
  error: null,
};
const sendOtpSlice = createSlice({
  name: "sendOtp",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendOtpThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(sendOtpThunk.rejected, (state, action) => {
        state.loading = true;
        state.success = false;
        console.log(action.error);
        if (action.error.message) {
          toast.error(action.error.message);
        }
      });
  },
});

export default sendOtpSlice.reducer;
