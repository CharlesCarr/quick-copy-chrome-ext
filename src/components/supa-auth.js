import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../config/supabase-client";

const SupaAuth = () => (
  <Auth
    supabaseClient={supabase}
    appearance={{
      theme: ThemeSupa,
      style: {
        input: {
          color: "white",
        },
      },
      variables: {
        default: {
          colors: {
            brand: "#8fcafa",
            brandAccent: "#03a9f4",
          },
        },
      },
    }}
    providers={["google"]}
  />
);

export default SupaAuth;
