import { supabase } from "../config/supabase-client";

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    //   email: "charliecarr4@gmail.com",
    //   password: "test1234",
    email,
    password,
  });

  return {
    data,
    error,
  };
}

export async function signInWithPassword(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    //   email: "charliecarr4@gmail.com",
    //   password: "test1234",
    email,
    password,
  });

  return {
    data,
    error,
  };
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  console.log(data);
  console.log(error);
}

// Found on GitHub --

export const extensionGoogleLogin = async () => {
  const chromeId = chrome.identity;
  console.log(chromeId);
  const redirectUri = chrome.identity.getRedirectURL("supabase-auth");
  console.log("redirectUri", redirectUri); // add this to your supabase auth redirect URLs list
  const options = {
    provider: "google",
    redirect_to: redirectUri,
  };
  /*
  const url = `https://rntrqodzicwzypdwjuez.supabase.co/auth/v1/authorize?${qs.stringify(options)}`;
  console.log("supabase auth url in extensionSupabaseLogin -->", url);

  const authorizeResult = await new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(
      {
        url,
        interactive: true,
      },
      (callbackUrl) => {
        resolve(callbackUrl);
      }
    );
  });
  if (!authorizeResult) {
    return { error: "No authorizeResult" };
  }
  const authResult = qs.parse(authorizeResult?.split("#")[1]);
  const refreshToken = authResult?.refresh_token;
  // as documented here: https://supabase.com/docs/reference/javascript/auth-signin#sign-in-using-a-refresh-token-eg-in-react-native
  const { user, session, error } = await supabase.auth.signIn({
    refreshToken,
  });
  console.log("user", user, "session", session, "error", error);
  if (error) {
    return { error };
  }
  return { user, session };
  */
};
