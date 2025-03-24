import React, {useContext, useState} from "react";
import { Alert, Text, TouchableOpacity, View ,Dimensions} from "react-native";
import axios from "axios";
import { Puzzle } from "../model/Puzzle";
import { globalStyles } from "../globalStyles";
import { API_URL } from "@env";
import {UserContext} from "../context/UserContext";
import {StoryContext} from "../context/StoryContext";

interface WordlePuzzleProps {
    puzzle: Puzzle;
    moveToNextLocation: () => void;
}

export default function WordlePuzzle({ puzzle, moveToNextLocation }: WordlePuzzleProps) {
    const [wordleGuesses, setWordleGuesses] = useState<string[]>([]);
    const [currentGuess, setCurrentGuess] = useState<string[]>(Array(puzzle.answer.length).fill(""));
    const [submittedGuesses, setSubmittedGuesses] = useState<boolean[]>(Array(6).fill(false));
    const [keyboardColors, setKeyboardColors] = useState<{ [key: string]: string }>({});
    const { width, height } = Dimensions.get("window");
    const { user, setUser } = useContext(UserContext)!;
    const {setToldTheStory} = useContext(StoryContext);




    const maxAttempts = 6;

    const validateWord = async (guess: string,answer :string) => {
        try {
            const response = await axios.post(`${API_URL}/validate-word`, { word: guess , answer:answer});
            return response.data.valid;
        } catch (error) {
            Alert.alert("Fout", "Het valideren van het woord is mislukt.");
            return false;
        }
    };

    const handleWordleSubmit = async () => {
        const guess = currentGuess.join("");
        const answer = puzzle.answer

        if (wordleGuesses.length >= maxAttempts || guess.length !== puzzle.answer.length) return;

        const isValid = await validateWord(guess,answer);

        if (!isValid) {
            Alert.alert("Ongeldig Woord", "Het woord dat je hebt ingevoerd is niet geldig. Probeer het opnieuw.");
            return;
        }

        const newGuesses = [...wordleGuesses, guess];
        setWordleGuesses(newGuesses);
        if (user) {
            setUser({
                ...user,
                wordleTries: user.wordleTries + 1,
            });
        }
        setSubmittedGuesses([...submittedGuesses.slice(0, wordleGuesses.length), true]);
        setCurrentGuess(Array(puzzle.answer.length).fill(""));

        updateKeyboardColors(guess);

        if (guess.toUpperCase() === puzzle.answer.toUpperCase()) {

            setToldTheStory(false)
            moveToNextLocation();

        } else if (newGuesses.length >= maxAttempts) {
            Alert.alert("Game Over", `Het juiste woord was: ${puzzle.answer}`);
            setToldTheStory(false)
            moveToNextLocation();
        }
    };

    const handleLetterInput = (letter: string) => {
        const updatedGuess = [...currentGuess];

        const firstEmptyIndex = updatedGuess.findIndex((char) => char === "");

        if (firstEmptyIndex !== -1) {
            updatedGuess[firstEmptyIndex] = letter;
            setCurrentGuess(updatedGuess);
        }
    };

    const handleBackspace = () => {
        const updatedGuess = [...currentGuess];

        let lastFilledIndex = -1;
        for (let i = updatedGuess.length - 1; i >= 0; i--) {
            if (updatedGuess[i] !== "") {
                lastFilledIndex = i;
                break;
            }
        }

        if (lastFilledIndex !== -1) {
            updatedGuess[lastFilledIndex] = "";
            setCurrentGuess(updatedGuess);
        }
    };


    const updateKeyboardColors = (guess: string) => {
        let updatedKeyboardColors = { ...keyboardColors };

        guess.split("").forEach((letter, index) => {
            const correctLetter = puzzle.answer[index];
            const currentColor = updatedKeyboardColors[letter.toUpperCase()];

            if (letter === correctLetter) {
                updatedKeyboardColors[letter.toUpperCase()] = "green";
            }
            else if (puzzle.answer.includes(letter)) {
                if (currentColor !== "green") {
                    updatedKeyboardColors[letter.toUpperCase()] = "orange";
                }
            }
            else if (currentColor !== "green" && currentColor !== "orange") {
                updatedKeyboardColors[letter.toUpperCase()] = "gray";
            }
        });

        setKeyboardColors(updatedKeyboardColors);
    };

    const getLetterColor = (letter: string, index: number, rowIndex: number) => {
        if (!letter || !submittedGuesses[rowIndex]) return "white";

        const answer = puzzle.answer.split("");
        const guess = wordleGuesses[rowIndex]?.split("") || [];

        const answerLetterCounts: Record<string, number> = {};
        answer.forEach((char) => {
            answerLetterCounts[char] = (answerLetterCounts[char] || 0) + 1;
        });

        const guessColors = Array(guess.length).fill("gray");
        const usedLetters: Record<string, number> = {};

        for (let i = 0; i < guess.length; i++) {
            if (guess[i] === answer[i]) {
                guessColors[i] = "green";
                usedLetters[guess[i]] = (usedLetters[guess[i]] || 0) + 1;
            }
        }

        for (let i = 0; i < guess.length; i++) {
            if (guessColors[i] !== "green" && answer.includes(guess[i])) {
                usedLetters[guess[i]] = (usedLetters[guess[i]] || 0) + 1;
                if (usedLetters[guess[i]] <= answerLetterCounts[guess[i]]) {
                    guessColors[i] = "orange";
                }
            }
        }

        return guessColors[index];
    };


    return (
        <View style={[globalStyles.container]}>
            <Text style={globalStyles.title}>WORDLE</Text>
            <Text style={globalStyles.title}>Raad het {puzzle.answer.length}-letter woord:</Text>

            {Array.from({ length: maxAttempts }).map((_, rowIndex) => {
                const guess = wordleGuesses[rowIndex] || (rowIndex === wordleGuesses.length ? currentGuess.join("") : "");

                return (
                    <View key={rowIndex} style={{ flexDirection: "row", marginBottom: 3, alignSelf:"center" }}>
                        {Array.from({ length: puzzle.answer.length }).map((_, letterIndex) => {
                            const guessLetter = guess[letterIndex] || "";
                            const backgroundColor = getLetterColor(guessLetter, letterIndex, rowIndex);

                            return (
                                <View
                                    key={letterIndex}
                                    style={{
                                        backgroundColor,
                                        padding: 0,
                                        margin: 1,
                                        borderRadius: 5,
                                        width: width * 0.15,
                                        height: width *0.15,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderWidth: 1,
                                        borderColor: "black",
                                    }}
                                >
                                    <Text style={{
                                        color: "black",
                                        fontWeight: "bold",
                                        fontSize:35
                                    }}>
                                        {guessLetter.toUpperCase()}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                );
            })}

            <View style={{ flexDirection: "column", alignItems: "center", marginTop: 20 }}>
                <View style={{ flexDirection: "row" }}>
                    {["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"].map((letter) => (
                        <TouchableOpacity
                            key={letter}
                            onPress={() => handleLetterInput(letter)}
                            style={{
                                backgroundColor: keyboardColors[letter] || "lightgray",
                                width: 34,
                                height: 45,
                                justifyContent: "center",
                                alignItems: "center",
                                margin: 2,
                                borderRadius: 5,
                            }}
                        >
                            <Text style={{ color: "black", fontWeight: "bold" }}>{letter}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ flexDirection: "row" }}>
                    {["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"].map((letter) => (
                        <TouchableOpacity
                            key={letter}
                            onPress={() => handleLetterInput(letter)}
                            style={{
                                backgroundColor: keyboardColors[letter] || "lightgray",
                                width: 34,
                                height: 45,
                                justifyContent: "center",
                                alignItems: "center",
                                margin: 2,
                                borderRadius: 5,
                            }}
                        >
                            <Text style={{ color: "black", fontWeight: "bold" }}>{letter}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                        onPress={handleWordleSubmit}
                        disabled={currentGuess.join("").length !== puzzle.answer.length}
                        style={{
                            width: 50,
                            height: 45,
                            justifyContent: "center",
                            alignItems: "center",
                            margin: 2,
                            borderRadius: 5,
                            marginTop: 2,
                            backgroundColor: currentGuess.join("").length === puzzle.answer.length ? "lightgray" : "gray" }}
                    >
                        <Text style={{ color: "black", fontWeight: "bold" }}>Enter</Text>
                    </TouchableOpacity>
                    {["W", "X", "C", "V", "B", "N"].map((letter) => (
                        <TouchableOpacity
                            key={letter}
                            onPress={() => handleLetterInput(letter)}
                            style={{
                                backgroundColor: keyboardColors[letter] || "lightgray",
                                width: 34,
                                height: 45,
                                justifyContent: "center",
                                alignItems: "center",
                                margin: 2,
                                borderRadius: 5,
                            }}
                        >
                            <Text style={{ color: "black", fontWeight: "bold" }}>{letter}</Text>
                        </TouchableOpacity>

                    ))}
                    <TouchableOpacity
                        onPress={handleBackspace}
                        style={{
                            backgroundColor: "lightgray",
                            width: 34,
                            height: 45,
                            justifyContent: "center",
                            alignItems: "center",
                            margin: 2,
                            borderRadius: 5,
                            marginTop: 2,
                        }}
                    >
                        <Text style={{ color: "black", fontWeight: "bold" }}>←</Text>
                    </TouchableOpacity>

                </View>

            </View>




        </View>
    );
}
