import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import authReducer from "./authSlice";
import overviewReducer from "./overviewSlice";


export default configureStore({
    reducer: {
        theme: themeReducer,
        auth: authReducer,
        overview: overviewReducer
    }
});


