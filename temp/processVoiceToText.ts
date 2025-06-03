import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

// Configuration constants
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';
const SPEECH_KEY = process.env.SPEECH_KEY || '';
const SPEECH_REGION = process.env.SPEECH_REGION || '';
const SPEECH_RECOGNITION_LANGUAGE = process.env.SPEECH_RECOGNITION_LANGUAGE || 'en-US';
const SPEECH_RECOGNITION_TIMEOUT = process.env.SPEECH_RECOGNITION_TIMEOUT || '5000';
const MAX_SPEECH_RECOGNITION_RETRIES = 3;

// Helper function for delay
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Process voice to text using Microsoft Cognitive Services
export const processVoiceToText = async (audioUri: string): Promise<string> => {
  // For demo purposes, we'll still use the mock
  if (USE_MOCK_DATA) {
    console.log('Using mock voice-to-text conversion');
    await delay(1000);
    return "Can you tell me about the new Hyundai models?";
  }
  
  console.log('Processing voice to text from URI:', audioUri);
  
  return new Promise<string>((resolve, reject) => {
    try {
      // Create speech config with detailed logging
      const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
        SPEECH_KEY,
        SPEECH_REGION
      );
      
      // Enable detailed logging
      speechConfig.enableAudioLogging();
      
      // Set speech recognition language from config
      speechConfig.speechRecognitionLanguage = SPEECH_RECOGNITION_LANGUAGE;
      
      // Configure timeouts
      speechConfig.setProperty(
        SpeechSDK.PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs, 
        `${SPEECH_RECOGNITION_TIMEOUT}`
      );
      speechConfig.setProperty(
        SpeechSDK.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs, 
        "500"
      );
      
      console.log(`Setting up speech recognition with language: ${SPEECH_RECOGNITION_LANGUAGE}`);
      
      // Create audio config from the file path
      // Convert string URI to a Buffer for the Speech SDK
      const fs = require('fs');
      const audioBuffer = fs.readFileSync(audioUri);
      const audioConfig = SpeechSDK.AudioConfig.fromWavFileInput(audioBuffer);
      
      // Create speech recognizer
      const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
      
      recognizer.recognized = (_s: unknown, e: { result: { text: string } }) => {
        console.log(`RECOGNIZED: Text=${e.result.text}`);
      };
      
      recognizer.recognizing = (_s: unknown, e: { result: { text: string } }) => {
        console.log(`RECOGNIZING: Text=${e.result.text}`);
      };
      
      recognizer.canceled = (_s: SpeechSDK.Recognizer, e: SpeechSDK.SpeechRecognitionCanceledEventArgs) => {
        console.log(`CANCELED: Reason=${e.reason}`);
        if (e.reason === SpeechSDK.CancellationReason.Error) {
          console.error(`CANCELED: ErrorCode=${e.errorCode}`);
          console.error(`CANCELED: ErrorDetails=${e.errorDetails}`);
        }
      };
      
      console.log('Starting speech recognition...');
      
      // Start speech recognition with retry logic
      let retryCount = 0;
      
      const attemptRecognition = () => {
        recognizer.recognizeOnceAsync(
          (result: SpeechSDK.SpeechRecognitionResult) => {
            if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
              console.log('Speech recognized successfully:', result.text);
              recognizer.close();
              resolve(result.text);
            } else {
              console.log('Speech recognition failed or timed out:', result.reason);
              recognizer.close();
              
              // Retry if we haven't reached the maximum number of retries
              if (retryCount < MAX_SPEECH_RECOGNITION_RETRIES) {
                retryCount++;
                console.log(`Retrying speech recognition (${retryCount}/${MAX_SPEECH_RECOGNITION_RETRIES})`);
                attemptRecognition();
              } else {
                // For development, return a mock result
                if (USE_MOCK_DATA) {
                  resolve("Can you tell me about the new Hyundai models?");
                } else {
                  reject(new Error(`Speech recognition failed: ${result.reason}`));
                }
              }
            }
          },
          (error: string) => {
            console.error('Error during speech recognition:', error);
            recognizer.close();
            
            // Retry if we haven't reached the maximum number of retries
            if (retryCount < MAX_SPEECH_RECOGNITION_RETRIES) {
              retryCount++;
              console.log(`Retrying speech recognition (${retryCount}/${MAX_SPEECH_RECOGNITION_RETRIES})`);
              attemptRecognition();
            } else {
              // For development, return a mock result
              if (USE_MOCK_DATA) {
                resolve("Can you tell me about the new Hyundai models?");
              } else {
                reject(new Error(error));
              }
            }
          }
        );
      };
      
      // Start the first recognition attempt
      attemptRecognition();
      
    } catch (error) {
      console.error('Error setting up speech recognition:', error);
      
      // For development, return a mock result
      if (USE_MOCK_DATA) {
        resolve("Can you tell me about the new Hyundai models?");
      } else {
        reject(error);
      }
    }
  });
};
