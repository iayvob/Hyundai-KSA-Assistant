# Hyundai KSA Assistant

A React Native application for Hyundai KSA, featuring a Microsoft Copilot-powered virtual assistant with Native App Channel integration.

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure Microsoft Copilot Studio Native App Channel:
   - Navigate to the [Microsoft Copilot Studio portal](https://web.powerva.microsoft.com/)
   - Create a new bot or open your existing bot
   - Navigate to Settings > Channels
   - Add Native App channel
   - Note down your Bot ID and endpoint URL
   - Update these values in `config/botConfig.ts`

## Microsoft Copilot Studio Native App Channel Integration

### Architecture Overview

The application integrates with Microsoft Copilot Studio using the Native App Channel, providing seamless interaction capabilities:

1. **Authentication**: The app establishes a connection to Microsoft Copilot Studio using the Native App Channel
2. **Conversation Management**: Maintains conversation state and handles message flow
3. **Rich Responses**: Processes bot responses including attachments like images, buttons, and cards

### Message Flow

1. User enters a text message
2. The message is sent to Microsoft Copilot Studio through the Native App Channel
3. Bot processes the message and returns a response
4. Response is displayed in the chat interface with any rich media content

### Configuration

When deploying to production, ensure you update the following in `config/botConfig.ts`:

```typescript
export const BOT_ID = 'your-bot-id';
export const TOKEN_ENDPOINT = 'your-native-app-endpoint';
export const USE_MOCK_DATA = false; // Set to false in production
```

For troubleshooting, check the console logs which provide detailed information about:
- Communication with the Native App API
- Error details when things go wrong

## Features

- Text chat with Microsoft Copilot virtual assistant
- Rich media display in chat (images, buttons, links)
- Message status tracking (sending, sent, delivered, read)

## Running the Application

```
npm run dev
```

## Deployment

For building:

```
npm run build:web
```

## Technologies Used

- React Native with Expo
- Microsoft Copilot Studio
- Native App Channel Integration

## License

MIT
