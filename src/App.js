import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Auth from "./pages/auth";
import { supabase } from "./config/supabase-client";
import { useEffect, useState } from "react";
import Profile from "./pages/profile";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  console.log("Session", session);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
    // <div style={{ padding: '50px 0 100px 0' }}>
    //   {!session ? <Auth /> : <Home key={session.user.id} session={session} />}
    // </div>
  );
}

export default App;
