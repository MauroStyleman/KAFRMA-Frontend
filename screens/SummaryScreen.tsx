import React, { useContext } from "react";
import { View, Text, FlatList, ScrollView, StyleSheet } from "react-native";
import { UserContext } from "../context/UserContext";
import { StoryContext } from "../context/StoryContext";
import { globalStyles } from "../globalStyles";

export default function SummaryScreen() {
    const { user } = useContext(UserContext)!;
    const { storyData } = useContext(StoryContext);

    if (!user) {
        return (
            <View style={globalStyles.container}>
                <Text style={globalStyles.title}>Loading user data...</Text>
            </View>
        );
    }

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Your Journey Summary</Text>

            <View style={globalStyles.rowContainer}>
                <View style={globalStyles.container}>
                    <Text style={globalStyles.text}>
                        <Text style={{ fontWeight: "bold" }}>Name:</Text> {user.name || "Unknown"}
                    </Text>
                    <Text style={globalStyles.text}>
                        <Text style={{ fontWeight: "bold" }}>Job:</Text> {user.job || "Unknown"}
                    </Text>
                    <Text style={globalStyles.text}>
                        <Text style={{ fontWeight: "bold" }}>Hobbies:</Text> {user.hobbies?.join(", ") || "None"}
                    </Text>
                </View>

                <View style={globalStyles.container}>
                    <Text style={globalStyles.text}>
                        <Text style={{ fontWeight: "bold" }}>Hints Asked:</Text> {user.hintsAsked || 0}
                    </Text>
                    <Text style={globalStyles.text}>
                        <Text style={{ fontWeight: "bold" }}>Puzzles:</Text> {user.puzzlesCompleted - user.puzzlesFailed || 0} / {user.puzzlesCompleted}
                    </Text>
                    <Text style={globalStyles.text}>
                        <Text style={{ fontWeight: "bold" }}>Wordle Tries:</Text> {user.wordleTries+1 || 0}
                    </Text>
                </View>
            </View>

            <Text style={[globalStyles.title, { fontSize: 20 }]}>Visited Locations:</Text>
            <FlatList
                data={storyData.locaties}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={globalStyles.container}>
                        <Text style={globalStyles.title}>{index + 1}. {item.naam}</Text>
                        <Text style={globalStyles.text}>{item.beschrijving}</Text>
                    </View>
                )}
                contentContainerStyle={globalStyles.flatListContainer}
            />
        </View>
    );
}


