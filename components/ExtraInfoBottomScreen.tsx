import React from "react";
import {ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {colors, globalStyles} from "../globalStyles";
import {Feather} from "@expo/vector-icons";
import {BottomSheet} from '@rneui/themed';


export function ExtraInfoBottomSheet(props: {
    onPress: () => void;
    visible: boolean;
    onRequestClose: () => void;
    wikiInfo: any;
    loading: boolean;
    backup_title: string;
    backup_description: string;
    isDisabled: boolean;
}) {
    const imageUrl =
        props.wikiInfo?.image_urls && props.wikiInfo.image_urls.length > 0
            ? props.wikiInfo.image_urls[Math.floor(Math.random() * props.wikiInfo.image_urls.length)]
            : null;

    const title = props.wikiInfo?.name;

    return (
        <>
            <TouchableOpacity style={[globalStyles.extra_info_button, props.isDisabled ? {opacity: 0.5} : {}]}
                              onPress={props.onPress} disabled={props.isDisabled}>
                <Feather name="book-open" size={24} color={colors.primary}/>
            </TouchableOpacity>

            <BottomSheet isVisible={props.visible} onBackdropPress={props.onRequestClose}>
                <View style={globalStyles.bottomScreenContainer}>
                    <View style={{ position: "absolute", top: 10, right: 10, zIndex: 10, elevation: 10 }}>
                        <TouchableOpacity onPress={props.onRequestClose} style={globalStyles.extra_info_closeButton}>
                            <Feather name="x" size={24} color="red"/>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={{ maxHeight: 400, padding: 20 }}>
                        {props.loading ? (
                            <ActivityIndicator size="large" color={colors.primary}/>
                        ) : props.wikiInfo ? (
                            <>
                                <Text style={globalStyles.bottomScreenTitle}>{title || props.backup_title}</Text>
                                <Text style={globalStyles.bottomScreenText}>{props.wikiInfo.summary || props.backup_description}</Text>
                                {imageUrl ? (
                                    <Image
                                        source={{ uri: imageUrl }}
                                        style={{ width: 200, height: 200, borderRadius: 10, marginVertical: 10 }}
                                        resizeMode="contain"
                                    />
                                ) : (
                                    <Text style={globalStyles.bottomScreenText}>Geen afbeelding beschikbaar</Text>
                                )}
                            </>
                        ) : (
                            <View>
                                <Text style={globalStyles.bottomScreenTitle}>{props.backup_title}</Text>
                                <Text style={globalStyles.bottomScreenText}>{props.backup_description}</Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </BottomSheet>
        </>
    );
}
