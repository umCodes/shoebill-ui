import { AuthContext } from "../contexts/AuthContext";
import { getUser, logout } from "../services/auth.services";
import type { User } from "../types/user.types";
import { useEffect, useState, type ReactNode } from "react"
import { logger } from "../utils/logs";

const AuthProvider = ({children}: {children: ReactNode}) => {

    const [user, setUser] = useState<User | null>(null);
    const [isGuest, setIsGuest] = useState<boolean>(
        localStorage.getItem("isGuest") === null ? 
        true :  
        localStorage.getItem("isGuest") === "true"
    )    
    const [isOpen, setIsOpen] = useState<boolean>(false)    
    
    async function logOutUser(){
            try {
                const response = await logout();
                logger.raw(`logged out ${response}`)
                setUser(null);
            } catch (error) {
                logger.error(error);               
            }    
    }

    let retries = 0;
    async function logUser(){
            try {
                const response = await getUser();
                logger.raw(response)
                setUser(response);
            } catch (error) {
                logger.error(error);
                if(retries > 5) return
                const delay = Math.pow(2, retries) * 2000;  
                retries++;
                setTimeout(getUser, delay);                
            }    
    }
    useEffect(()=>{
        (() => logUser())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
    <AuthContext.Provider value={{user, isGuest, setIsGuest, setUser, isOpen, setIsOpen, logUser, logOutUser}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider