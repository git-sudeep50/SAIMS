import axios from "axios";

const baseURL = "http://localhost:7000/api";

export async function loginUser(email: string, password: string) {
  try {
    const response = await axios.post(
      `${baseURL}/auth/login`,
      {
        email: email,
        password: password,
      },
      { headers: { "Content-Type": "application/json" },withCredentials: true }
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function checkUserAccount(email: string) {
  try {
    const response = await axios.post(
      `${baseURL}/auth/register`,
      {
        email: email,
      },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    return response.data;
  } catch (err) {
    return err;
  }
}

export async function logoutUser() {
  try {
    const response = await axios.post(
      `${baseURL}/auth/logout`,
      {},
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function signUpUser(email: string, OTP: string, password: string) {
  try {
    const response = await axios.post(
      `${baseURL}/auth/verify`,
      {
        email: email,
        OTP: OTP,
        password: password,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
}
