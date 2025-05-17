import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "../utils/authSlice";
import axios from "axios";

const baseURL = "http://localhost:7000/api";

const useAuth = () => {
    const dispatch = useDispatch();
    console.log("Inside use auth");
    useEffect(() => {
        const getAuthUser = async () => {
            try{
                const userData = await axios.get(`${baseURL}/auth/get-auth-user`,{withCredentials: true});
                console.log("USER DATA", userData)
                const newData = {
                    email: userData?.data?.data?.email,
                    roles: userData?.data?.data?.roles.map((role: string) =>role ),
                };
                console.log("DATA FROM",newData);
                dispatch(setCredentials(newData));
            }catch(err){
                dispatch(logout());
            }
        }

        getAuthUser();
    }, [dispatch]);
};

export default useAuth;