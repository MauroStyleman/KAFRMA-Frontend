import {Puzzle} from "./Puzzle";

export interface profile {
    name: string;
    age: number;
    job: string;
    hobbies: string[];
    location_index: number;
    puzzle: Puzzle | null;
    hintsAsked: number;
    wordleTries: number;
    puzzlesCompleted: number;
    puzzlesFailed: number;
}