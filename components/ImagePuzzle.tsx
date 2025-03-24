import React, {useState, useEffect, useContext} from "react";
import { Alert, Text, TouchableOpacity, View, Image, ScrollView } from "react-native";
import { globalStyles } from "../globalStyles";
import { Puzzle } from "../model/Puzzle";
import {UserContext} from "../context/UserContext";
import {StoryContext} from "../context/StoryContext";

interface ImagePuzzleProps {
    puzzle: Puzzle;
    moveToNextLocation: () => void;
}

export default function ImagePuzzle({ puzzle, moveToNextLocation }: ImagePuzzleProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<string>("");
    const {setToldTheStory} = useContext(StoryContext);


    useEffect(() => {
        if (selectedAnswer !== "") {
            if (selectedAnswer === puzzle.answer) {
                setToldTheStory(false)

                moveToNextLocation();

            } else {
                Alert.alert("Dit is niet het juiste antwoord", "Probeer opnieuw.");
            }
        }
    }, [selectedAnswer]);

    const multipleChoiceOptions = puzzle["multiple-choice"];

    if (!multipleChoiceOptions) {
        return <Text>No multiple choice options available.</Text>;
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 1 }}>
            <View style={globalStyles.container}>
                <Image
                    source={{ uri: puzzle.image_url }}
                    style={{ width: "100%", height: 300, marginBottom: 3, borderRadius: 10 }}
                    resizeMode="contain"
                />

                <Text style={globalStyles.title}>{puzzle.question}</Text>

                <View style={{ marginBottom: 5 }}>
                    {Object.entries(multipleChoiceOptions).map(([key, value]) => (
                        <TouchableOpacity
                            key={key}
                            onPress={() => setSelectedAnswer(key)} // Just set the selected answer, check happens in useEffect
                            style={{
                                backgroundColor: selectedAnswer === key ? "blue" : "lightgray",
                                padding: 10,
                                marginVertical: 5,
                                borderRadius: 10,
                            }}
                        >
                            <Text style={{ color: selectedAnswer === key ? "white" : "black", textAlign: "center" }}>
                                {value}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
