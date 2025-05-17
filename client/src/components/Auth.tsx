import React, { useEffect, useState } from "react";
import styles from "./css/Auth.module.css";
import validator from "validator";
import { loginUser, checkUserAccount, signUpUser } from "../utils/authUtilityFunctions";
import { useDispatch } from "react-redux";
import { setCredentials } from "../utils/authSlice";

const Auth: React.FC = () => {
  const dispatch = useDispatch();
  const [activeButton, setActiveButton] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [signupTouched, setSignupTouched] = useState({ email: false,OTP: false, password: false });
  const [submitting, setSubmitting] = useState(false);
  const [stepperSteps, setStepperSteps] = useState({
    step1: false,
    step2: false,
    step3: false,
  });
  const [signupData, setSignupData] = useState({
    email: "",
    OTP: "",
    password: "",
  });

  const login = async () => {
    setSubmitting(true);
    try {
      const response = await loginUser(loginData.email, loginData.password);
      const userData = {
        email: response.data.email,
        roles: response.data.roles.map((r: any) => r.role),
      };
      dispatch(setCredentials(userData));
      console.log(userData);
    } catch (err) {
      console.log(err);
    }
    // setTouched( {...touched, email: false, otp: false, password: false });
    setSubmitting(false);
  };

  const sendOTP = async () => {
  setSubmitting(true);
  try {
    const response = await checkUserAccount(signupData.email);
    console.log(response);
    if (response &&response.status === 200) {
      setStepperSteps({ ...stepperSteps, step1: true });
    } else {
      setStepperSteps({ ...stepperSteps, step1: false });
    }

  } catch (err:any) {
    if (err.response) {
      console.log("ERROR STATUS:", err.response.data.status); 
    } else {
      console.log("Network or unknown error:", err.message);
    }
    setStepperSteps({ ...stepperSteps, step1: false });
  }

  setSubmitting(false);
};


  const signup = async ( ) => {
    setSubmitting(true);
    setStepperSteps({ ...stepperSteps, step2: true});
    try {
      const response = await signUpUser(signupData.email,signupData.OTP, signupData.password);
      const userData = {
        email: response.data.email,
        roles: response.data.roles,
      };
      setStepperSteps({ ...stepperSteps, step3: true });
      dispatch(setCredentials(userData));
      console.log(userData);
    } catch (err) {
      console.log(err);
      setStepperSteps({ ...stepperSteps,step2: false, step3: false });
    }
    setSubmitting(false);
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-slate-200">
      <div
        className={`${styles.container} h-[70vh] w-[40vw] bg-slate-400  rounded-md`}
      >
        <div className="buttons rounded-md flex p-2">
          <button
            className={`w-[50%] cursor-pointer h-12 ${
              activeButton === "login"
                ? "bg-slate-400 text-black"
                : "bg-black text-white hover:bg-slate-300"
            }`}
            onClick={() => setActiveButton("login")}
          >
            Login
          </button>
          <button
            className={`w-[50%] cursor-pointer rounded-md h-12 ${
              activeButton === "signup"
                ? "bg-slate-400 text-black"
                : "bg-black text-white hover:bg-slate-300"
            }`}
            onClick={() => setActiveButton("signup")}
          >
            Signup
          </button>
        </div>

        <div
          className={`${styles["auth-container"]}  bg-slate-400 w-[100%] h-full `}
        >
          {activeButton === "login" ? (
            <div className={`flex flex-col`}>
              <label htmlFor="email" className={`text-white`}>
                Email:
              </label>
              <input
                type="text"
                onBlur={() => setTouched({ ...touched, email: true })}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                className={`${
                  styles["input-box"]
                } border border-amber-300 rounded-md px-4 py-2 outline-none w-full ${
                  touched.email && !validator.isEmail(loginData.email)
                    ? "border-red-500"
                    : "border-amber-300"
                }`}
              />
              <label htmlFor="password" className={`text-white`}>
                Password
              </label>
              <input
                type="password"
                onBlur={() => setTouched({ ...touched, password: true })}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className={`${
                  styles["input-box"]
                } border border-amber-300 rounded-md px-4 py-2 outline-none w-full ${
                  touched.password &&
                  !validator.matches(loginData.password, /^[\w\W]{6,}$/)
                    ? "border-red-500"
                    : "border-amber-300"
                }`}
              />
              <button
                className={`${styles["submit-button"]} `}
                onClick={() => login()}
              >
                {submitting ? "Logging in..." : "Login"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-[100%] items-center justify-center">
              <div
                className={`${styles.stepper} w-full flex items-center justify-center gap-1`}
              >
                <div
                  className={`circle h-7 w-7 rounded-[50%] bg-amber-50 flex items-center justify-center ${
                    stepperSteps.step1 ? "bg-green-500" : "bg-amber-50"
                  }`}
                >
                  1
                </div>
                <div
                  className={`bar h-4 w-[30%] bg-amber-100 rounded-md ${
                    stepperSteps.step1 ? "bg-green-500" : "bg-amber-100"
                  }`}
                ></div>
                <div
                  className={`circle h-7 w-7 rounded-[50%] bg-amber-50 flex items-center justify-center ${
                    stepperSteps.step2 ? "bg-green-500" : "bg-amber-100"
                  }`}
                >
                  2
                </div>
                <div
                  className={`bar h-4 w-[30%] bg-amber-100 rounded-md ${
                    stepperSteps.step2 ? "bg-green-500" : "bg-amber-100"
                  }`}
                ></div>
                <div
                  className={`circle h-7 w-7 rounded-[50%] bg-amber-50 flex items-center justify-center ${
                    stepperSteps.step3 ? "bg-green-500" : "bg-amber-100"
                  }`}
                >
                  3
                </div>
              </div>

              <div className={`flex flex-col`}>
                <label htmlFor="email" className={`text-white`}>
                  Email
                </label>
                <input
                  type="text"
                  onBlur={() => setSignupTouched({ ...signupTouched, email: true })}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                  className={`${
                    styles["input-box"]
                  } border border-amber-300 rounded-md px-4 py-2 outline-none w-full ${
                    signupTouched.email && !validator.isEmail(signupData.email)
                      ? "border-red-500"
                      : "border-amber-300"
                  }`}
                  placeholder="Enter the Email"
                />
                {stepperSteps.step1 && (
                  <>
                    <label htmlFor="email" className={`text-white`}>
                      OTP
                    </label>
                    <input
                      type="text"
                      onBlur={()=>setSignupTouched({...signupTouched,OTP:true})}
                      onChange={(e) =>
                        setSignupData({ ...signupData, OTP: e.target.value })
                      }
                      className={`${
                        styles["input-box"]
                      } border border-amber-300 rounded-md px-4 py-2 outline-none w-full ${
                        signupTouched.OTP && !validator.matches(signupData.OTP, /^\d{6}$/)
                          ? "border-red-500"
                          : "border-amber-300"
                      }`}
                      placeholder="Enter your email"
                    />

                    <label htmlFor="password" className={`text-white`}>
                      Password
                    </label>
                    <input
                      type="password"
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                      className={`${
                        styles["input-box"]
                      } border border-amber-300 rounded-md px-4 py-2 outline-none w-full ${
                        signupTouched.password && !validator.matches(signupData.password, /^[\w\W]{6,}$/)
                          ? "border-red-500"
                          : "border-amber-300"
                      }`}
                      placeholder="Enter your password"
                    />
                  </>
                )}

                {stepperSteps.step1 ? (
                  <button
                    onClick={() => signup()}
                    className={`${styles["submit-button"]} `}
                  >
                    {submitting ? "Signing up..." : "Sign Up"}
                  </button>
                ) : (
                  <button
                    onClick={() => sendOTP()}
                    className={`${styles["submit-button"]} `}
                  >
                    {submitting ? "Wait..." : "Check Account"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
