import { createClient } from "@supabase/supabase-js";

// NO NEED TO HIDE IN .ENV IF ROW LEVEL SECURITY IS SET UP PROPERLY
// CONFIRM BEFORE SHIP TO WEB STORE
const supabaseUrl = "https://rntrqodzicwzypdwjuez.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJudHJxb2R6aWN3enlwZHdqdWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU2MzM4MjEsImV4cCI6MTk5MTIwOTgyMX0.hDnyjocaz-nh9sH-Q_lLP9k_YXZfCUnLUKW8IAii7X0";

// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
// const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
