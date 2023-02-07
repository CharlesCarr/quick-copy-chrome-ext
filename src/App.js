import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Auth from "./pages/auth";
import { supabase } from "./config/supabase-client";
import { useEffect, useState } from "react";
import Profile from "./pages/profile";
import ProtectedRoute from "./pages/helpers/protected-route";
import Snippets from "./pages/snippets";

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
        <Route path="/auth" element={<Auth />} />
        <Route element={<ProtectedRoute session={session} />}>
          <Route path="/" element={<Home session={session} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/snippets" element={<Snippets />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
