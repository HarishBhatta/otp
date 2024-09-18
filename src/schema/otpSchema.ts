import { z } from "zod";

export const otpFieldSchema = z
  .string()
  .min(1, { message: "Cannot be empty" })
  .refine((val) => /^[0-9]$/.test(val), {
    message: "Must be a digit",
  });
