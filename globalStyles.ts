import {StyleSheet} from "react-native";
import {Dimensions} from "react-native";

export const colors = {
    text: "#ebedf8",
    background: "#020308",
    primary: "#8b98e7",
    secondary: "#17299a",
    accent: "#1f3be9",
};
const { width, height } = Dimensions.get("window");

const font = 'Iceberg';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 8,
    },
    title: {
        fontSize: 24,
        color: colors.text,
        textAlign: "center",
        marginBottom: 20,
        fontFamily: font,
    },
    text: {
        fontSize: 16,
        color: colors.text,
        marginBottom: 10,
        fontFamily: font,

    },
    input: {
        width: "100%",
        height: 40,
        borderWidth: 1,
        borderColor: colors.primary,
        paddingHorizontal: 10,
        marginBottom: 20,
        borderRadius: 5,
        color: colors.text,
        backgroundColor: "#111",
        fontFamily: font,

    },
    button: {
        backgroundColor: colors.accent,
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        height: 40,
        marginTop: 20,
        fontFamily: font,

    },
    submitButton: {
        backgroundColor: "blue",
        color:"white",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        height: 40,
        marginTop: 20,
        fontFamily: font,

    },
    buttonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: font,
    },

    navigationContainer: {
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        fontFamily: font,
    },
    leftButton: {
        alignSelf: "flex-start",
        fontFamily: font,
    },
    rightButton: {
        alignSelf: "flex-end",
        fontFamily: font,
    },
    hobbyItem: {
        color: colors.text,
        marginRight: 8,
        fontSize: 16,
        fontFamily: font,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    bottomScreenContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
    },
    bottomScreenText: {
        marginBottom: 15,
        fontSize: 18,
        color: 'black',
        fontFamily: font,
    },
    bottomScreenContent: {
        flexGrow: 1,
        alignItems: "center",
    },
    bottomScreenTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.primary,
        textAlign: "center",
        marginBottom: 20,
        fontFamily: font,
    },
    extra_info_button: {
        backgroundColor: colors.accent,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
    },
    extra_info_closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "transparent",
        padding: 10,
        borderRadius: 20,
        height: 40,
    },
    wordleKeyboard: {
        backgroundColor: "lightgray",
        width: width *0.09,
        height: width *0.09,
        justifyContent: "center",
        alignItems: "center",
        margin: 2,
        borderRadius: 5,
        marginTop: 2,
    },

    rowContainer: {
        flexDirection: "row", // This places the two views next to each other
        justifyContent: "space-evenly", // Optionally space them out if needed
        marginBottom: 10, // Add spacing if needed between rows
    },
    flatListContainer: {
        paddingTop: 10, // Optional padding for FlatList content
    }

});
