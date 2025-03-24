import React, {useContext} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {useNavigation} from "@react-navigation/native";
import {StoryContext} from "../context/StoryContext";
import {UserContext} from "../context/UserContext";
import {rootStackParamList} from "../rootStackParamList";
import {globalStyles} from "../globalStyles";
import TourProgress from "../components/TourProgress";


type StoryScreenNavigationProp = StackNavigationProp<rootStackParamList, "NextLocation">;

export default function NextLocationScreen() {
    const {storyData, setToldTheStory} = useContext(StoryContext);
    const {user} = useContext(UserContext) || {};
    const navigation = useNavigation<StoryScreenNavigationProp>();

    const locations = storyData?.locaties || [];
    const currentLocationIndex = user?.location_index ?? 0;
    const currentLocation = locations[currentLocationIndex] || {naam: "Onbekende locatie"};

    const isSpeaking = false;

    const goToNextScreen = () => {
        setToldTheStory(false);
        navigation.reset({
            index: 0,
            routes: [{name: "Story"}],
        });
    };

    return (
        <View style={globalStyles.container}>

            <View style={{ marginBottom: 30, marginTop: 30 }}>
                <TourProgress visitedSteps={currentLocationIndex + 1} locations={locations} />
            </View>


            <Text style={[globalStyles.title, { paddingTop: 70}]}>{currentLocation.naam}</Text>
            <TouchableOpacity
                onPress={() => goToNextScreen()}
                style={[globalStyles.button, isSpeaking ? { opacity: 0.5 } : {}]}
                disabled={isSpeaking}
            >
                <Text style={globalStyles.buttonText}>Aangekomen!</Text>
            </TouchableOpacity>
        </View>

    );

}
