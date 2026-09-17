import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../lib/firebase';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

// Managed-workflow Google sign-in via the generic AuthSession browser flow (no
// native module / dev-client rebuild needed). Requires a Google Cloud web
// OAuth client id in EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID; until that's set,
// signIn() throws a clear configuration error instead of pretending to work.
export function useGoogleSignIn() {
  const clientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const [, , promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: clientId || 'unconfigured',
      scopes: ['openid', 'profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri(),
      responseType: AuthSession.ResponseType.IdToken,
    },
    discovery,
  );

  async function signIn() {
    if (!clientId) {
      throw new Error("Google sign-in isn't configured yet.");
    }
    const result = await promptAsync();
    if (result.type !== 'success') {
      throw new Error('Google sign-in was cancelled.');
    }
    const idToken = result.params.id_token;
    await signInWithCredential(auth, GoogleAuthProvider.credential(idToken));
  }

  return { signIn };
}
