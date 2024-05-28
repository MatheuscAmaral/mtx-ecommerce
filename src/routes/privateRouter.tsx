import { Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export const PrivateRoute = ({children}: any) => {
    const {user, authUser} = useContext(AuthContext);
    
    useEffect(() => {
        const verifyStoredUser =  () => {
            const storedUser = localStorage.getItem("@userEcommerce");
        
            if (storedUser != null) {
                const user = JSON.parse(storedUser);
                authUser(user);
            }
        }

        verifyStoredUser();
    }, [])

    return user.length > 0 ? children : <Navigate to={"/login"}/>;
}