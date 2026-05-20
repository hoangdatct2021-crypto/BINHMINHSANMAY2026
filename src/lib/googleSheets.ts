import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Request sheets scope
provider.addScope('https://www.googleapis.com/auth/spreadsheets');

// Cache the access token in memory.
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      // If we already have the token cached, trigger success
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Logged into Firebase but token needs to be re-acquired via login
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// Google Sheet configurations
export const SPREADSHEET_ID = "1Q8ymo12HVnC_eOY9y98hoyKPnqaArwgvrLMdeZ9HqBw";
export const RANGE = "'langdingpage 01'!A:H";

export interface BookingData {
  time: string;
  fullName: string;
  phone: string;
  guests: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  notes: string;
}

export const appendBookingToSheet = async (data: BookingData, token: string): Promise<boolean> => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(RANGE)}:append?valueInputOption=USER_ENTERED`;
    
    const body = {
      range: RANGE,
      majorDimension: "ROWS",
      values: [
        [
          data.time,
          data.fullName,
          data.phone,
          data.guests,
          data.checkIn,
          data.checkOut,
          data.roomType,
          data.notes
        ]
      ]
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Failed to append to sheet:', errText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error calling Google Sheets API:', error);
    return false;
  }
};
