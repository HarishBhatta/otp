import React, { useEffect, useRef, useState } from "react";
import { otpFieldSchema } from "../schema/otpSchema";
import { Toaster } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { sendOtpThunk } from "../redux/thunk/sendOtpThunk";
import { useNavigate } from "react-router-dom";

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);
  const [errors, setErrors] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    new Array(6).fill(null)
  );

  const handleOnChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const newOTP: string[] = [...otp];
    const newErrors: string[] = [...errors];

    if (value.length === 1) {
      newOTP[activeOTPIndex] = value;
      setActiveOTPIndex((prev) => Math.min(prev + 1, otp.length - 1));
    }

    const validationResult = otpFieldSchema.safeParse(newOTP[activeOTPIndex]);
    newErrors[activeOTPIndex] = validationResult.success
      ? ""
      : validationResult.error.format()._errors[0];
    setOtp(newOTP);
    setErrors(newErrors);
  };

  const validateOtp = () => {
    const newErrors = otp.map((field) => {
      if (field === "") return "Cannot be empty";
      const validationResult = otpFieldSchema.safeParse(field);
      return validationResult.success
        ? ""
        : validationResult.error.format()._errors[0];
    });
    setErrors(newErrors);
    return newErrors;
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOTP = [...otp];

    pastedData.forEach((val, i) => {
      if (i < otp.length) {
        newOTP[i] = val;
      }
    });

    setOtp(newOTP);
    const newErrors = validateOtp();
    setErrors(newErrors);
    setActiveOTPIndex(Math.min(pastedData.length, otp.length - 1));
  };

  const handleOnKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      const newOTP = [...otp];
      if (otp[index]) {
        newOTP[index] = "";
      }
      setOtp(newOTP);
      const newErrors = validateOtp();
      setErrors(newErrors);
      setActiveOTPIndex(index > 0 ? index - 1 : 0);
    } else if (e.key === "ArrowRight" && index < otp.length - 1) {
      setActiveOTPIndex(index + 1);
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveOTPIndex(index - 1);
    }
  };

  useEffect(() => {
    inputRefs.current[activeOTPIndex]?.focus();
  }, [activeOTPIndex]);

  const loading = useAppSelector((state) => state.sendOtpState.loading);

  const handleSubmit = () => {
    const otpCode = parseInt(otp.join(""));
    dispatch(sendOtpThunk({ otp: otpCode, callback: handleSuccess }));
    console.log(otpCode);
  };
  const handleSuccess = () => {
    navigate("/success");
  };

  return (
    <>
      {loading && (
        <div className="absolute h-[100vh] w-full bg-black opacity-55 flex justify-center items-center">
          <span className="text-white text-xl font-semibold">Loading....</span>
        </div>
      )}
      <section className="flex flex-col gap-4 justify-center items-center h-[100vh]">
        <Toaster />
        <i className="bx bxs-lock"></i>
        {/* <h2 className="text-2xl font-extrabold">Verification Code:</h2> */}
        <div className="flex justify-center gap-1">
          {otp.map((_, index) => (
            <React.Fragment key={index}>
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                className={`rounded-md border border-black w-10 h-10 text-center font-bold outline-none ${
                  errors[index] ? "border-red-500" : ""
                }`}
                onChange={handleOnChange}
                onPaste={handlePaste}
                onKeyDown={(e) => handleOnKeyDown(e, index)}
                value={otp[index]}
                maxLength={1}
              />
              {index < otp.length - 1 && <span className={"w-2 py-0.5 "} />}
            </React.Fragment>
          ))}
        </div>
        <div className="button">
          <button
            className="bg-[#100249] px-12 py-3 text-white font-semibold rounded-md"
            onClick={handleSubmit}
            disabled={errors.some((error) => error)}
          >
            Submit OTP
          </button>
        </div>
      </section>
    </>
  );
}

export default App;
