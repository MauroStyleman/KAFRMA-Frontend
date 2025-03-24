import React from "react";
import {Text, TouchableOpacity, View,} from "react-native";

import {X} from "lucide-react-native";

import {colors, globalStyles} from "../globalStyles";

export const HobbyItem = ({ hobby, onRemove }: { hobby: string; onRemove: () => void }) => (
    <View style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.accent,
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: 20,
        margin: 5,
        width: "auto",
    }}>
        <Text style={globalStyles.hobbyItem}>{hobby}</Text>
        <TouchableOpacity onPress={onRemove}>
            <View style={{
                borderColor: colors.secondary,
                borderWidth: 1,
                borderRadius: 360,
                backgroundColor: colors.secondary,
                padding: 2,
                justifyContent: "center",
                alignItems: "center",
            }}>
                <X color="red"/>
            </View>
        </TouchableOpacity>
    </View>
);
