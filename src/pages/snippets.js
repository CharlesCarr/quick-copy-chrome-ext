import React, { useEffect, useState } from "react";
import CreateFirstSnip from "../components/create-first-snip";
import Snip from "../components/snip";
import { supabase } from "../config/supabase-client";

const Snippets = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [userSnips, setUserSnips] = useState(true);

  // Need function for getting snips for the user
  useEffect(() => {
    getSnips();
  }, []);

  const getSnips = async () => {
    try {
      setLoading(true);
      const { user } = session;

      let { data, error, status } = await supabase
        .from("snips")
        .select(`id, user_id, snip_text, name, category`)
        .eq("user_id", user.id);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        console.log("DATA RETURNED", data);
        setUserSnips(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Snippets</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {userSnips.length > 0 ? (
          userSnips.map((d) => {
            return <Snip key={d.id} data={d} />;
          })
        ) : (
          <CreateFirstSnip session={session} />
        )}
      </div>
    </div>
  );
};

export default Snippets;
