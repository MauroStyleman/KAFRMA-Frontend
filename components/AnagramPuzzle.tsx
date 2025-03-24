import React, {useContext, useState} from "react";
import {Alert, Text, TextInput, TouchableOpacity, View} from "react-native";
import {Puzzle} from "../model/Puzzle";
import {globalStyles} from "../globalStyles";
import {UserContext} from "../context/UserContext";
import {StoryContext} from "../context/StoryContext";

interface AnagramPuzzleProps {
    puzzle: Puzzle;
    moveToNextLocation: () => void;
}

export default function AnagramPuzzle({puzzle, moveToNextLocation}: AnagramPuzzleProps) {
    const [userAnswer, setUserAnswer] = useState<string>("");
    const {setToldTheStory} = useContext(StoryContext);
    const scrambleWord = (word: string): string => {
        let scrambled = word.split("").sort(() => Math.random() - 0.5).join("");
        while (scrambled === word) {
            scrambled = word.split("").sort(() => Math.random() - 0.5).join("");
        }
        return scrambled;
    };

    const checkAnswer = () => {
        if (userAnswer.toLowerCase().trim() === puzzle.answer.toLowerCase().trim()) {
            setToldTheStory(false);
            moveToNextLocation();

        } else {
            Alert.alert("Dit is niet het juiste antwoord", "Probeer opnieuw.");
        }
    };

    return (
        <View>
            <Text style={globalStyles.text}>{puzzle.puzzle}</Text>
            <Text style={globalStyles.text}>Unscramble this: {scrambleWord(puzzle.answer)}</Text>
            <TextInput style={globalStyles.input}
                       placeholderTextColor="white"

                       placeholder="Type your answer here"
                       value={userAnswer}
                       onChangeText={setUserAnswer}
            />
            <TouchableOpacity onPress={checkAnswer} style={globalStyles.submitButton}>
                <Text style={globalStyles.buttonText}>Submit Answer</Text>
            </TouchableOpacity>
        </View>
    );
}
