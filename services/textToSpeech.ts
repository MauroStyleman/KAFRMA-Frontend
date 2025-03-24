import * as FileSystem from "expo-file-system";
import {Audio} from "expo-av";
import {API_KEY_AZURE} from "@env";

const AZURE_API_KEY = API_KEY_AZURE
const AZURE_REGION = 'westeurope';

export const speakText = async (text: string, geslacht: string,onFinished: () => void) => {

    if (!text) {
        console.log("Geen tekst gevonden om uit te spreken.");
        return;
    }
    console.log("Tekst:", text);

    const geslachtLower = geslacht.toLowerCase();
    let voice = 'nl-Nl-FennaNeural';
    let gender = 'Female';
    let pitch = 'default';
    let rate = '1.2';

    if (geslachtLower === "man") {
        voice = 'nl-Nl-MaartenNeural';
        gender = 'Male';
        pitch = 'default';
        rate = '1.2';
    }


    try {
        console.log("🔹 Verstuur aanvraag naar Azure TTS...");

        const url = `https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;

        const headers = {
            'Ocp-Apim-Subscription-Key': AZURE_API_KEY,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        };

        const body = `
        <speak version='1.0' xml:lang='nl-BE'>
        <voice xml:lang='nl-BE' xml:gender='${gender}' name='${voice}'>
                   <prosody rate="${rate}" pitch="${pitch}">
            ${text}
        </prosody>
            </voice>
        </speak>`;


        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Azure API Error: ${response.status} - ${errorText}`);
            return;
        }

        console.log("✅ Azure response ontvangen, audio wordt opgeslagen...");

        const blob = await response.blob();
        const audioUri = FileSystem.documentDirectory + 'audio.mp3';

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
            if (typeof reader.result === 'string') {
                const base64Audio = reader.result.split(',')[1];
                await FileSystem.writeAsStringAsync(audioUri, base64Audio, {
                    encoding: FileSystem.EncodingType.Base64,
                });
            }

            const {sound} = await Audio.Sound.createAsync(
                {uri: audioUri},
                {shouldPlay: true}
            );
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && !status.isPlaying && status.positionMillis === status.durationMillis) {
                    onFinished();
                }
            });


            await sound.playAsync();

            await FileSystem.deleteAsync(audioUri);
        };

    } catch (error) {
        console.error('Fout in Azure TTS:', error);
    }
};
