import React, { useContext, useState } from "react";
import { Alert, Modal, Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { colors, globalStyles } from "../globalStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { HobbyItem } from "../components/HobbyItem";
import axios from 'axios';
import { profile } from "../model/Profile";
import { StoryContext } from "../context/StoryContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { rootStackParamList } from "../rootStackParamList";
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';
import { UserContext } from "../context/UserContext";

type ProfileScreenNavigationProp = StackNavigationProp<rootStackParamList, "Profile">;

export default function ProfileCreationScreen() {
    const [hobby, setHobby] = useState("");
    const [hobbies, setHobbies] = useState<string[]>([]);
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [job, setJob] = useState("");
    const [loading, setLoading] = useState(false);
    const { setStoryData } = useContext(StoryContext);
    const { setUser } = useContext(UserContext);
    const navigation = useNavigation<ProfileScreenNavigationProp>();

    const addHobby = () => {
        if (hobby.trim() !== "") {
            setHobbies([...hobbies, hobby.trim()]);
            setHobby("");
        }
    };

    const removeHobby = (index: number) => {
        setHobbies(hobbies.filter((_, i) => i !== index));
    };

    const MAX_RETRIES = 5;

    const submitForm = async () => {
        if (!name || !age || !job || hobbies.length === 0) {
            Alert.alert('Error', 'Please fill all fields and add at least one hobby.');
            return;
        }

        setLoading(true);

        const userData: profile = {
            name,
            job,
            age: Number(age),
            hobbies,
            location_index: 0,
            puzzle: null,
            hintsAsked: 0,
            wordleTries: 0,
            puzzlesCompleted: 0,
            puzzlesFailed: 0,
        };

        setUser(userData);

        let attempts = 0;
        const timeout = 60000;

        while (attempts < MAX_RETRIES) {
            try {
                const response = await axios.post(`${API_URL}/generate-tour`, userData, { timeout });

                console.log('Response:', response.data);
                setLoading(false);
                setStoryData(response.data);

                navigation.reset({
                    index: 0,
                    routes: [{ name: 'StartStory' }],
                });
                return;
            } catch (error) {
                attempts++;
                console.error(`Attempt ${attempts} failed:`, error);

                if (attempts >= MAX_RETRIES) {
                    setLoading(false);
                    Alert.alert('Error', 'Failed to generate tour after multiple attempts. Please try again later.');
                    return;
                }

                await new Promise((resolve) => setTimeout(resolve, 2000));
            }
        }
    };


    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={globalStyles.container}
            extraScrollHeight={100}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={globalStyles.title}>Profiel</Text>

            <Text style={globalStyles.text}>Naam</Text>
            <TextInput
                style={globalStyles.input}
                placeholder="Voer je naam in"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={setName}
                editable={!loading}
            />

            <Text style={globalStyles.text}>Leeftijd</Text>
            <TextInput
                style={globalStyles.input}
                placeholder="Voer je leeftijd in"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
                editable={!loading}
            />

            <Text style={globalStyles.text}>Beroep</Text>
            <TextInput
                style={globalStyles.input}
                placeholder="Voer je beroep in"
                placeholderTextColor="#aaa"
                value={job}
                onChangeText={setJob}
                editable={!loading}
            />

            <Text style={globalStyles.text}>Hobbies</Text>
            <TextInput
                style={[globalStyles.input]}
                placeholder="Geef een hobby in"
                placeholderTextColor="#aaa"
                value={hobby}
                onSubmitEditing={addHobby}
                onBlur={addHobby}
                editable={!loading}
                onChangeText={(text) => {
                    setHobby(text);
                    if (text.endsWith(" ")) {
                        addHobby();
                    }
                }}
            />

            <View style={{
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
            }}>
                {hobbies.map((item, index) => (
                    <HobbyItem key={index.toString()} hobby={item} onRemove={() => removeHobby(index)} />
                ))}
            </View>

            <TouchableOpacity
                style={globalStyles.button}
                onPress={() => {
                    if (hobby.trim() !== "") {
                        addHobby();
                    }
                    submitForm();
                }}
                disabled={loading}
            >
                {loading ? (
                    <Text style={globalStyles.buttonText}>Submitting...</Text>
                ) : (
                    <Text style={globalStyles.buttonText}>Start Avontuur!</Text>
                )}
            </TouchableOpacity>

            <Modal
                visible={loading}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setLoading(false)}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}>
                    <View style={{
                        backgroundColor: 'black',
                        paddingBottom: 20,
                        borderRadius: 20,
                        alignItems: 'center',
                    }}>
                        <Image
                            source={{ uri: 'https://64.media.tumblr.com/50f4634a59ac7941f68dd1b7c025d84a/2ce0784fbabdae46-05/s500x750/0ff6a49408dae3547c05ccb333585d1e4d3fe13c.jpg' }}  // Replace with your image URL
                            style={{ width: 300, height: 350, marginBottom: 20,borderRadius:20 }}
                        />
                        <Text style={globalStyles.text}>We contacteren uw gids...</Text>
                    </View>
                </View>
            </Modal>

        </KeyboardAwareScrollView>
    );
}
