import React, { useEffect, useState } from "react";
import { supabase } from "../config/supabase-client";

const Home = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  // Will want a useEffect here to check if user already signed in
  // if not then navigate automatically to auth page (?)
  useEffect(() => {
    getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { user } = session;

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>HOME PAGE</h1>

      <p>Session User Email{session.user.email}</p>

      <p>{`Username ${username}`}</p>
      <p>{`Website ${website}`}</p>
      <p>{`Avatar URL ${avatar_url}`}</p>

      <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
    </div>
  );
};

export default Home;
