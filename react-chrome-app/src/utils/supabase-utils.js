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
