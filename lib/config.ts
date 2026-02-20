import { Platform } from 'react-native';

const USE_MOCK =
  process.env.EXPO_PUBLIC_USE_MOCK === 'true' ||
  process.env.EXPO_PUBLIC_USE_MOCK === '1';

function resolveApiUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) return envUrl;

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001';
  }

  return 'http://localhost:3001';
}

export const config = {
  useMock: USE_MOCK,
  apiUrl: resolveApiUrl(),
} as const;
