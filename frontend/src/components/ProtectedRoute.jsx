import React from 'react'
import {Navigate} from "react-router-dom";

export const ProtectedRoute = ({children}) => {
    const token  = localStorage.getItem("token");
    // console.log("Entered protector");
    if(!token){
        // console.log("no token in protector");
        return <Navigate to="/login" replace/>;
    }
    return children;
}

export default ProtectedRoute;