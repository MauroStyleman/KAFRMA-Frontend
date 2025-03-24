import React from "react";
import {View, Text, Button, StyleSheet, TouchableOpacity} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import {globalStyles} from "../globalStyles";
import {rootStackParamList} from "../rootStackParamList";



type HomeScreenNavigationProp = StackNavigationProp<rootStackParamList, "Home">;

type Props = {
    navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Welkom bij Ghost Hunting</Text>
            <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("Profile")}>
                <Text style={globalStyles.buttonText}>Start Zoektocht</Text>
            </TouchableOpacity>
        </View>
    );
}


