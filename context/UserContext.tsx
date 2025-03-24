import { createContext, ReactNode, useState } from "react";
import {Puzzle} from "../model/Puzzle";

interface UserProfile {
    name: string;
    age: number;
    job: string;
    hobbies: string[];
    location_index: number;
    puzzle: Puzzle | null;
    hintsAsked: number | 0;
    wordleTries: number | 0;
    puzzlesCompleted: number | 0;
    puzzlesFailed: number | 0;
}

interface UserContextType {
    user: UserProfile | null;
    setUser: (user: UserProfile) => void;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
});

interface UserProviderProps {
    children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
    const [user, setUser] = useState<UserProfile | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
