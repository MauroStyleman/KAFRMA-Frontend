import React, {useContext, useState} from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Puzzle } from "../model/Puzzle";
import {globalStyles} from "../globalStyles";
import {UserContext} from "../context/UserContext";
import {StoryContext} from "../context/StoryContext";

interface MultipleChoicePuzzleProps {
    puzzle: Puzzle;
    moveToNextLocation: () => void;
}

export default function MultipleChoicePuzzle({ puzzle, moveToNextLocation}: MultipleChoicePuzzleProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<string>("");
    const {setToldTheStory} = useContext(StoryContext);



    const checkAnswer = (answer: string) => {
        if (answer === puzzle.answer) {
            setToldTheStory(false)
            moveToNextLocation();

        } else {
            Alert.alert("Dit is niet het juiste antwoord", "Probeer opnieuw.");
        }
    };

    const multipleChoiceOptions = puzzle["multiple-choice"];

    if (!multipleChoiceOptions) {
        return <Text>No multiple choice options available.</Text>;
    }

    return (
        <View>
            <Text style={globalStyles.text}>{puzzle.puzzle}</Text>
            {Object.entries(multipleChoiceOptions).map(([key, value]) => (
                <TouchableOpacity
                    key={key}
                    onPress={() => {
                        setSelectedAnswer(value);
                        checkAnswer(value);
                    }}
                    style={{
                        backgroundColor: selectedAnswer === value ? "blue" : "lightgray",
                        padding: 10,
                        marginVertical: 5,
                        borderRadius:10

                    }}
                >
                    <Text style={{ color:selectedAnswer === value ? "white":"black", textAlign: "center" }}>{value}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}
