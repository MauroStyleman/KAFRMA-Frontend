import React, {useContext, useEffect, useState} from "react";
import {ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {StoryContext} from "../context/StoryContext";
import {UserContext} from "../context/UserContext";
import {globalStyles} from "../globalStyles";
import axios from "axios";
import {API_URL} from "@env";
import {StackNavigationProp} from "@react-navigation/stack";
import {rootStackParamList} from "../rootStackParamList";
import {useNavigation} from "@react-navigation/native";
import {Puzzle} from "../model/Puzzle";
import WordlePuzzle from "../components/WordlePuzzle";
import AnagramPuzzle from "../components/AnagramPuzzle";
import MultipleChoicePuzzle from "../components/MultipleChoicePuzzle";
import ImagePuzzle from "../components/ImagePuzzle";
import {Ionicons} from "@expo/vector-icons"; // Import icons


type PuzzleScreenNavigationProp = StackNavigationProp<rootStackParamList, "Puzzle">;

export default function PuzzleScreen() {
    const {storyData} = useContext(StoryContext);
    const {user, setUser} = useContext(UserContext)!;
    const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
    const [loading, setLoading] = useState(false);
    const [hint, setHint] = useState<string | null>(null);
    const [hintCount, setHintCount] = useState(0);
    const navigation = useNavigation<PuzzleScreenNavigationProp>();
    const locations = storyData.locaties;
    const hasLocations = locations && locations.length > 0;
    const isLastLocation = user?.location_index === locations.length - 1;
    const MAX_RETRIES = 5;



    useEffect(() => {
        if (user?.puzzle) {
            setPuzzle(user.puzzle);
        } else if (user && hasLocations && user.location_index >= 0) {
            if (isLastLocation && user?.location_index >= 0) {
                fetchWordle(locations[user.location_index]);
            } else {
                fetchPuzzle(locations[user.location_index]);
            }
        }
    }, [user, user?.location_index, hasLocations, user?.puzzle, isLastLocation]);

    const giveUp = () => {
        if (!puzzle || !user) return;

        const updatedUser = {
            ...user,
            puzzlesFailed: (user.puzzlesFailed || 0) + 1,
        };

        setUser(updatedUser);

        Alert.alert("The Answer", `The correct answer is: ${puzzle.answer}`, [
            { text: "OK", onPress: () => moveToNextLocation(updatedUser) },
        ]);
    };



    const fetchPuzzle = async (location: Location) => {
        if (!user) return;
        setLoading(true);

        let success = false;
        let puzzleData = null;
        let attempts = 0;

        while (!success && attempts < MAX_RETRIES) {
            try {
                const response = await axios.post(`${API_URL}/generate-puzzle`, {
                    location: location.naam,
                    location_info: location.beschrijving,
                    user_interests: user.hobbies,
                    user_job: user.job,
                    location_story: location.beschrijving,
                });

                if (response.status === 200 && response.data.puzzle) {
                    success = true;
                    puzzleData = response.data.puzzle;
                }
            } catch (error) {
                attempts++;
                console.error(`Attempt ${attempts} failed:`, error);
                if (attempts >= MAX_RETRIES) {
                    Alert.alert("Error", "Failed to load puzzle after multiple attempts.");
                    break;
                }
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }
        }

        if (puzzleData) {
            setPuzzle(puzzleData);
            setUser({ ...user, puzzle: puzzleData });
        }

        setLoading(false);
    };


    const fetchWordle = async (location: Location) => {
        if (!user) return;
        setLoading(true);

        let validWord = false;
        let puzzleData = null;
        let attempts = 0;

        while (!validWord && attempts < MAX_RETRIES) {
            try {
                const response = await axios.post(`${API_URL}/generate-wordle`, {
                    location: location.naam,
                    location_info: location.beschrijving,
                    user_interests: user.hobbies,
                    user_job: user.job,
                    location_story: location.beschrijving,
                });

                if (response.data.puzzle.answer.length === 5) {
                    validWord = true;
                    puzzleData = response.data.puzzle;
                }
            } catch (error) {
                attempts++;
                console.error(`Attempt ${attempts} failed:`, error);
                if (attempts >= MAX_RETRIES) {
                    Alert.alert("Error", "Failed to load Wordle puzzle after multiple attempts.");
                    break;
                }
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }
            setLoading(false)
        }

        if (puzzleData) {
            setPuzzle(puzzleData);
            setUser({ ...user, puzzle: puzzleData });
        }

        setLoading(false);
    };


    const moveToNextLocation = (updatedUser?: typeof user) => {
        const currentUser = updatedUser || user;
        if (!currentUser) return;

        const nextIndex = currentUser.location_index + 1;
        if (nextIndex >= locations.length) {
            if (!updatedUser) {
                setUser({
                    ...currentUser,
                    puzzlesCompleted: (currentUser.puzzlesCompleted || 0) + 1,
                });
            }
            navigation.reset({ index: 0, routes: [{ name: "Summary" }] });
        } else {
            setUser({
                ...currentUser,
                location_index: nextIndex,
                puzzle: null,
                puzzlesCompleted: !updatedUser 
                    ? (currentUser.puzzlesCompleted || 0) + 1 
                    : (currentUser.puzzlesCompleted || 0),
            });
            setPuzzle(null);
            setHint(null);
            setHintCount(0);
            navigation.reset({ index: 0, routes: [{ name: "NextLocation" }] });
        }
    };




    const fetchHint = async () => {
        if (!puzzle || hintCount >= 3 || !user) return;

        let attempts = 0;

        while (attempts < MAX_RETRIES) {
            try {
                const response = await axios.post(`${API_URL}/hint`, {
                    location: storyData.locaties[user.location_index]?.naam,
                    question: puzzle.puzzle || puzzle.question,
                    answer: puzzle.answer,
                    hint_level: hintCount + 1,
                });

                setHint(response.data.hint);
                setHintCount(hintCount + 1);
                setUser({
                    ...user,
                    hintsAsked: user.hintsAsked + 1,
                });
                return;
            } catch (error) {
                attempts++;
                console.error(`Attempt ${attempts} failed:`, error);

                if (attempts >= MAX_RETRIES) {
                    Alert.alert("Error", "Failed to load hint after multiple attempts.");
                    return;
                }

                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }
    };


    if (loading) {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black"}}>
                <ActivityIndicator size="large" color="white"/>
            </View>
        );
    }
    if (!puzzle) return <Text style={globalStyles.text}>No puzzle available.</Text>;


    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                padding: 1,
                alignItems: "center",
                backgroundColor: "black"
            }}>
                <TouchableOpacity
                    onPress={fetchHint}
                    disabled={hintCount >= 3}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginRight: 15,
                        opacity: hintCount >= 3 ? 0.5 : 1
                    }}
                >
                    <Ionicons name="bulb" size={24} color={hintCount < 3 ? "orange" : "gray"}/>
                    <Text style={{marginLeft: 5, color: hintCount < 3 ? "orange" : "gray", fontWeight: "bold"}}>
                        {3 - hintCount}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={giveUp}>
                    <Ionicons name="close-circle" size={24} color="red"/>
                </TouchableOpacity>
            </View>

            <View style={globalStyles.container}>

                {isLastLocation && puzzle.puzzle_type === "wordle" &&
                    <WordlePuzzle puzzle={puzzle} moveToNextLocation={moveToNextLocation}/>}

                {puzzle.puzzle_type === "anagram" &&
                    <AnagramPuzzle puzzle={puzzle} moveToNextLocation={moveToNextLocation}/>}
                {(puzzle.puzzle_type === "multiple-choice" || puzzle.puzzle_type === "multiple_choice" || puzzle.puzzle_type === "multiple choice") &&
                    <MultipleChoicePuzzle puzzle={puzzle} moveToNextLocation={moveToNextLocation}/>}
                {puzzle.puzzle_type === "image" &&
                    <ImagePuzzle puzzle={puzzle} moveToNextLocation={moveToNextLocation}/>}


                {hint && <View style={{marginTop: 10, padding: 10, backgroundColor: "#f0f0f0", borderRadius: 5}}><Text
                    style={{fontStyle: "italic", color: "#333"}}>Hint: {hint}</Text></View>}

            </View>
        </ScrollView>
    );
}
