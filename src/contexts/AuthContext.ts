import type { User } from "../types/user.types";
import { createContext, type Dispatch, type SetStateAction } from "react";


export type UserState = {
    isGuest: boolean,
    setIsGuest: Dispatch<SetStateAction<boolean>>;
    user: User | null,
    setUser: Dispatch<SetStateAction<User | null>>,
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    logUser: () => Promise<void>;
    logOutUser: () => void;
}

export const AuthContext = createContext<UserState>({
    isGuest: localStorage.getItem("isGuest") === null ? true :  localStorage.getItem("isGuest") === "true"  ,
    setIsGuest: () => {},
    user: null,
    isOpen: false,
    setIsOpen: () => {},
    setUser: () => {},
    logUser: async () => {},
    logOutUser: () => {}
});