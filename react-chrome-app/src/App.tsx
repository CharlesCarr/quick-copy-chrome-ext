import { useEffect, useState } from "react";
import { MemoryRouter as Router, Route, Routes } from "react-router-dom";
import { supabase } from "./config/supabase-client";
import DefaultSnippets from "./pages/default-snippets";
import Profile from "./pages/profile";
import Snippets from "./pages/snippets";
import { extensionGoogleLogin } from "./utils/supabase-utils";

function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // testing
    extensionGoogleLogin();

    // believe this needs to be tweaked as well
    supabase.auth.getSession().then(({ data: { session } }) => {
      // TODO: think need to add check here and navigate (?)
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultSnippets session={session} />} />
        <Route path="/snippets" element={<Snippets session={session} />} />
        <Route path="/profile" element={<Profile session={session} />} />
      </Routes>
    </Router>
  );
}

export default App;
