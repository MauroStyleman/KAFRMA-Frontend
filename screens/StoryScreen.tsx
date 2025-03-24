import React, {useContext, useEffect, useState} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {StoryContext} from "../context/StoryContext";
import {globalStyles} from "../globalStyles";
import {UserContext} from "../context/UserContext";
import {StackNavigationProp} from "@react-navigation/stack";
import {rootStackParamList} from "../rootStackParamList";
import {useNavigation} from "@react-navigation/native";
import {getWikiInfo} from "../services/wikiInfo";
import {ExtraInfoBottomSheet} from "../components/ExtraInfoBottomScreen";
import TourProgress from "../components/TourProgress";
import {TypeAnimation} from "react-native-type-animation";
import {speakText} from "../services/textToSpeech";


type StoryScreenNavigationProp = StackNavigationProp<rootStackParamList, "Story">;
export default function StoryScreen() {
    const {storyData, toldTheStory, setToldTheStory} = useContext(StoryContext);
    const {user} = useContext(UserContext)!;
    const navigation = useNavigation<StoryScreenNavigationProp>();

    const locations = storyData.locaties;

    const currentLocationIndex = user?.location_index ?? 0;

    const currentLocation = locations && locations[currentLocationIndex];

    const [modalVisible, setModalVisible] = useState(false);
    const [wikiInfo, setWikiInfo] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const isDemo = useState(true)

    useEffect(() => {
        if(!isDemo) {
            if (storyData && !toldTheStory) {
                setToldTheStory(true);
                setIsSpeaking(true);
                speakText(currentLocation.beschrijving, storyData.historische_figuur.geslacht, () => {
                    setToldTheStory(true);
                    setIsSpeaking(false);
                })
                    .catch(() => {
                        setIsSpeaking(false);
                        setToldTheStory(false);
                    });
            }
        }
    }, [storyData]);


    const openModal = async () => {
        setModalVisible(true);
        if (!wikiInfo) {
            setLoading(true);
            const title = currentLocation.wiki_naam;
            const name = currentLocation.naam;
            const data = await getWikiInfo(title);
            setWikiInfo({ ...data, name });
            setLoading(false);
        }
    };

    return (
        <View style={[globalStyles.container, { flex: 1 }]}>
            <View style={{ marginBottom: 30, marginTop: 30 }}>
                <TourProgress visitedSteps={currentLocationIndex + 1} locations={locations} />
            </View>

            <View style={{ flex: 1 }}>
                {currentLocation ? (
                    <>
                        <View
                            style={{
                                marginTop: 50,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 10,
                            }}
                        >
                            <Text style={globalStyles.title}>{currentLocation.naam}</Text>
                            <ExtraInfoBottomSheet
                                onPress={openModal}
                                visible={modalVisible}
                                onRequestClose={() => setModalVisible(false)}
                                wikiInfo={wikiInfo}
                                loading={loading}
                                backup_title={currentLocation.naam}
                                backup_description={"Geen beschrijving beschikbaar"}
                                isDisabled={isSpeaking}
                            />
                        </View>

                        <Text style={globalStyles.text}>{currentLocation.beschrijving}</Text>


                    </>
                ) : (
                    <Text style={globalStyles.text}>No location available</Text>
                )}

                <TouchableOpacity
                    onPress={() => navigation.navigate("Puzzle")}
                    style={[globalStyles.button, isSpeaking ? {opacity: 0.5} : {}]}
                    disabled={isSpeaking}
                >
                    <Text style={globalStyles.buttonText}>Los de puzzel op</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

}
