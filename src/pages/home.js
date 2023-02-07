import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase-client";

const Home = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const navigate = useNavigate();

  console.log(session);

  // Will want a useEffect here to check if user already signed in
  // if not then navigate automatically to auth page (?)
  useEffect(() => {
    getProfile();
  }, []);
  // session

  const getProfile = async () => {
    try {
      setLoading(true);
      const { user } = session;

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`id, username, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        console.log(data);
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (err) {
      console.error(err);
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

      <button onClick={() => navigate("/snippets")}>Go to Snippets</button>

      {/* <p>Session User Email{session.user.email}</p> */}

      <p>{`Username ${username}`}</p>
      <p>{`Avatar URL ${avatar_url}`}</p>

      <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
    </div>
  );
};

export default Home;
