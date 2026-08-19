const OAUTH_STATE_KEY = "oauthState";

export const createOAuthState = () => {
  const state = crypto.randomUUID();
  sessionStorage.setItem(OAUTH_STATE_KEY, state);
  return state;
};

export const verifyOAuthState = (receivedState: string | null) => {
  const storedState = sessionStorage.getItem(OAUTH_STATE_KEY);
  sessionStorage.removeItem(OAUTH_STATE_KEY);
  return !!receivedState && !!storedState && receivedState === storedState;
};
