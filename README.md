# EmailBuddy

AI-powered email writing assistant built with Expo (React Native + TypeScript) and a Next.js backend.

## Project Structure

```
├── app/                   # Expo Router screens
│   ├── _layout.tsx        # Root Stack navigator
│   ├── index.tsx          # Home screen (compose form)
│   └── result.tsx         # Result screen (generated email)
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and API layer
│   ├── api/email.ts       # Backend fetch wrapper
│   ├── config.ts          # Environment config
│   ├── generateEmailMock.ts  # Offline mock generator
│   └── theme.ts           # Design tokens
├── types/                 # TypeScript types
├── backend/               # Next.js API server
│   └── src/
│       ├── app/api/generate-email/  # POST endpoint
│       ├── lib/           # Validation, prompts, OpenAI client
│       └── types/         # Shared backend types
```

## Prerequisites

- Node.js >= 20
- npm
- Expo Go app (iOS/Android) for mobile testing
- OpenAI API key (for real generation)

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env.local
```

Edit `backend/.env.local` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-...
```

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3001/api/generate-email`.

### 2. Mobile App

From the project root:

```bash
# Copy the env template
cp .env.example .env

# Edit .env to configure:
# - EXPO_PUBLIC_USE_MOCK=false   (to use real backend)
# - EXPO_PUBLIC_API_URL=...      (if needed)
```

Start the Expo dev server:

```bash
npm start
```

Then press `w` for web, `i` for iOS simulator, or `a` for Android emulator.

## Environment Variables

### Mobile App (root `.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `EXPO_PUBLIC_USE_MOCK` | `true` | Set to `false` to call the real backend |
| `EXPO_PUBLIC_API_URL` | auto-detected | Backend URL override |

**API URL auto-detection:**
- iOS simulator / web: `http://localhost:3001`
- Android emulator: `http://10.0.2.2:3001`
- Physical device: set `EXPO_PUBLIC_API_URL` to your computer's LAN IP (e.g. `http://192.168.1.42:3001`)

### Backend (`backend/.env.local`)

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key (required) |

## API Reference

### POST /api/generate-email

**Request body:**

```json
{
  "mode": "new",
  "recipient": "John Smith",
  "tone": "Professional",
  "length": "medium",
  "intent": "Request a meeting to discuss Q3 results",
  "incomingEmail": null
}
```

- `mode`: `"new"` or `"reply"`
- `recipient`: non-empty string
- `tone`: Professional, Friendly, Concise, Empathetic, Apologetic, Persuasive, Formal, Casual
- `length`: `"short"`, `"medium"`, or `"long"`
- `intent`: non-empty string describing the email purpose
- `incomingEmail`: required when mode is `"reply"`, otherwise `null`

**Success response (200):**

```json
{
  "subject": "Meeting Request: Q3 Results Discussion",
  "body": "Dear John Smith,\n\n..."
}
```

**Error response (400/500):**

```json
{
  "error": "\"recipient\" is required and must be a non-empty string."
}
```

## Development Notes

- The mobile app defaults to mock mode (`EXPO_PUBLIC_USE_MOCK=true`) so you can develop the UI without a backend.
- The backend uses `gpt-4o-mini` by default. Change the model in `backend/src/lib/openai.ts`.
- CORS is configured to allow all origins in development. Restrict this before deploying to production.
