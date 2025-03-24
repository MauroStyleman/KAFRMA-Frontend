import axios from "axios";
import {API_URL} from "@env";

export const getWikiInfo = async (title: string) => {
    try {
        const formattedTitle = title.replaceAll(" ", '_');
        const response = await axios.get(`${API_URL}/extra_info/${formattedTitle}`);
        console.log('Wiki info:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching wiki info:', error);
        return null;
    }
};
