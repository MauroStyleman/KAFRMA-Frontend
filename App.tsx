import React, {useEffect, useState} from "react";
import HomeScreen from "./screens/HomeScreen";
import ProfileCreationScreen from "./screens/ProfileCreationScreen";
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from '@react-navigation/native';
import {colors, globalStyles} from "./globalStyles";
import {StoryProvider} from "./context/StoryContext";
import StoryScreen from "./screens/StoryScreen";
import {UserProvider} from "./context/UserContext";
import * as Font from 'expo-font';
import {ActivityIndicator, View} from "react-native";
import StartStoryScreen from "./screens/StartStoryScreen";
import PuzzleScreen from "./screens/puzzleScreen";
import SummaryScreen from "./screens/SummaryScreen";
import NextLocationScreen from "./screens/NextLocationScreen";


const Stack = createStackNavigator();




export default function App() {

    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        async function loadFonts() {
            await Font.loadAsync({
                'Iceberg': require('./assets/fonts/Iceberg-Regular.ttf'),
            });
            setFontsLoaded(true);
        }

        loadFonts();
    }, []);




    if (!fontsLoaded) {
        return (
            <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }


    return (
        <UserProvider>

            <StoryProvider>
                <NavigationContainer>
                    <Stack.Navigator
                        screenOptions={{
                            headerStyle: {
                                backgroundColor: colors.background,
                            },
                            headerTintColor: colors.secondary,
                            headerTitle: "",
                        }}
                    >
                        <Stack.Screen name="Home" component={HomeScreen}/>
                        <Stack.Screen name="Profile" component={ProfileCreationScreen}/>
                        <Stack.Screen
                            name="StartStory"
                            component={StartStoryScreen}
                            options={{
                                gestureEnabled: false,
                                headerLeft: undefined,
                            }}
                        />
                        <Stack.Screen
                            name="Story"
                            component={StoryScreen}
                            options={{
                                gestureEnabled: false,
                                headerLeft: undefined,
                            }}
                        />
                        <Stack.Screen
                            name="Summary"
                            component={SummaryScreen}
                            options={{
                                gestureEnabled: false,
                                headerLeft: undefined,
                            }}
                        />
                        <Stack.Screen
                            name="Puzzle"
                            component={PuzzleScreen}
                            options={{
                                gestureEnabled: false,
                                headerLeft: undefined,
                            }}
                        />
                        <Stack.Screen name="NextLocation"
                                      component={NextLocationScreen}
                                      options={{
                                          gestureEnabled: false,
                                          headerLeft: undefined,
                                      }}
                        />

                    </Stack.Navigator>
                </NavigationContainer>
            </StoryProvider>
        </UserProvider>

    )
        ;
}
