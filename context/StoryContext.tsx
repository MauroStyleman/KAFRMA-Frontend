import {createContext, ReactNode, useState} from "react";


interface StoryContextType {
    storyData: any;
    setStoryData: (data: any) => void;
    toldTheStory: boolean;
    setToldTheStory: (value: boolean) => void;

}

export const StoryContext = createContext<StoryContextType>({
    storyData: null,
    toldTheStory: false,
    setToldTheStory: () => {},
    setStoryData: () => {},
});

interface StoryProviderProps {
    children: ReactNode;
}

export function StoryProvider({ children }: StoryProviderProps) {
    const [storyData, setStoryData] = useState<any>(null);
    const [toldTheStory, setToldTheStory] = useState<boolean>(false);

    return (
        <StoryContext.Provider value={{ storyData, setStoryData,toldTheStory,setToldTheStory }}>
            {children}
        </StoryContext.Provider>
    );
}
