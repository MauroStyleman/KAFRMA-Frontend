import React, {useContext, useEffect, useState} from "react";
import {StoryContext} from "../context/StoryContext";
import axios from "axios";
import {API_URL} from "@env";
import {ExtraInfoBottomSheet} from "../components/ExtraInfoBottomScreen";
import {globalStyles} from "../globalStyles";
import {Text, TouchableOpacity, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {rootStackParamList} from "../rootStackParamList";
import {getWikiInfo} from "../services/wikiInfo";
import {speakText} from "../services/textToSpeech";
import {TypeAnimation} from "react-native-type-animation";


type StartStoryScreenNavigationProp = StackNavigationProp<rootStackParamList, "StartStory">;

export default function StartStoryScreen() {
    const {storyData,toldTheStory,setToldTheStory} = useContext(StoryContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [wikiInfo, setWikiInfo] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<StartStoryScreenNavigationProp>();
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        if (storyData && !toldTheStory) {
            setIsSpeaking(true);
            speakText(storyData.verhaal, storyData.historische_figuur.geslacht, () => {
                setToldTheStory(true);
                setIsSpeaking(false);
            })
                .catch(() => setIsSpeaking(false));
        }
    }, [storyData]);


    const openModal = async () => {
        setModalVisible(true);
        if (!wikiInfo) {
            setLoading(true);
            const title = storyData.historische_figuur.naam;
            const data = await getWikiInfo(title);
            setWikiInfo(data);
            setLoading(false);
        }
    };

    const goToNextScreen = () => {
        setToldTheStory(false);
        navigation.reset({
            index: 0,
            routes: [{ name: 'NextLocation' }],
        });
    };



    return (

        <View style={globalStyles.container}>
            <View>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10
                }}>
                    <Text style={globalStyles.title}>{storyData.historische_figuur.naam}</Text>

                    <ExtraInfoBottomSheet
                        onPress={openModal}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                        wikiInfo={wikiInfo}
                        loading={loading}
                        backup_title={storyData.historische_figuur.naam}
                        backup_description={storyData.historische_figuur.beschrijving}
                        isDisabled={isSpeaking}
                    />
                </View>

                <Text style={globalStyles.text}>{storyData.verhaal}</Text>

                <TouchableOpacity
                    onPress={goToNextScreen}
                    style={[globalStyles.button, isSpeaking ? { opacity: 0.5 } : {}]}
                    disabled={isSpeaking}
                >
                    <Text style={globalStyles.buttonText}>Ga naar de eerste locatie</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}