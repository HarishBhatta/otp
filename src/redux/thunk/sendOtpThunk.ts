import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
interface ApiError {
  message: string;
}
interface SendArgs {
  otp: number;
  callback: () => void;
}
export const sendOtpThunk = createAsyncThunk<string, SendArgs>(
  "sendOtp",
  async ({ callback, otp }) => {
    try {
      const response = await axios.post("/api/otp", { otp: otp });
      toast.success(response.data.message);
      callback();
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;

      if (axiosError.response && axiosError.response.data) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("Network error: ");
      }
    }
  }
);
