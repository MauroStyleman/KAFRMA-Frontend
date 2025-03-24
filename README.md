# Ghost Hunting Frontend

## We have developed a service using LLM, RAG, and MCP that generates a guided tour with puzzles for each location, based on your own text files.
## This is the frontend, we used React-native for it with Expo Go.

## Backend
Link to the backend repository: [KAFRMA-Frontend](https://github.com/MauroStyleman/KAFRMA-Backend)

## Team
- **Kacper Chrolowski**  
  - [LinkedIn](https://www.linkedin.com/in/kacper-chrolowski-b16606212/)
- **Frans Dillen**  
  - [LinkedIn](https://www.linkedin.com/in/frans-dillen-99b42a235/)
- **Mauro Styleman**  
  - [LinkedIn](https://www.linkedin.com/in/mauro-styleman-696936258/)

## Usage
```bash
npm expo start -c
```
## Setup Requirements
To run the frontend locally, follow these steps:

1. **Install Expo Go**  
   Download and install **Expo Go** on your mobile device to run the app.  
   You can find the app on the [App Store](https://apps.apple.com/us/app/expo-go/id982107779) for iOS or [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US) for Android.

2. **Clone the Repository**  
   First, clone the repository to your local machine:
   ```bash
   git clone https://github.com/MauroStyleman/KAFRMA-Frontend.git
   cd KAFRMA-Frontend
   ```
3. **Install Dependencies**
  ```
   npm install
   ```
4. **Setup Environment Variables**
   Inside the project directory, create an .env file and add the following keys:
   ```
   API_URL=http://<IP_ADDRESS>:8000
   API_KEY_AZURE=YOUR_OWN_KEY
   ```
   Replace <IP_ADDRESS> with the IP of the backend, and YOUR_OWN_KEY with your Azure TTS API key if you plan to use text-to-speech functionality.
5. **Start the Development Server**
   ```
   npm expo start -c
   ```

