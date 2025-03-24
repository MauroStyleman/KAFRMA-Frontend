export interface Puzzle {
    puzzle_type: "multiple_choice" | "multiple choice" | "multiple-choice" | "anagram" | "wordle" | "image";  // Add 'image' as a valid puzzle type
    puzzle: string;
    answer: string;
    "multiple-choice"?: {
        answerA: string;
        answerB: string;
        answerC: string;
        answerD: string;
    };
    image_url?: string;
    question?: string;
}
