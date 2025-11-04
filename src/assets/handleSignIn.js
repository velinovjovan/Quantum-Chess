import { supabase } from "./supabaseClient";

export const handleSignIn = async (provider) => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${window.location.origin}/account`,
    },
  });
  if (error) console.error("Error signing in:", error.message);
};
