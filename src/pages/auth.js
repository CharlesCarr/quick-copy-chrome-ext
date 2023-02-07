import React, { useState } from "react";
import {
  signInWithGoogle,
  signInWithPassword,
  signUp,
} from "../utils/supabase-utils";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // function for signing in
      try {
        const { data, error } = await signInWithPassword(email, password);
        if (error) throw new Error(error);
        console.log(data);
        console.log("User ID", data.user.id);
        navigate("/");
      } catch (err) {
        console.error(err);
      }
    } else {
      if (password === confirmPassword) {
        // function for signing up
        try {
          const { data, error } = await signUp(email, password);
          if (error) throw new Error(error);
          console.log(data);
          setIsLogin(true);
        } catch (err) {
          console.error(err);
        }
      } else {
        // temporary (will replace with toast)
        alert("Passwords do not match!");
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>AUTH PAGE</h1>

      <div style={{ display: "flex", columnGap: "10px", marginBottom: "10px" }}>
        <button onClick={() => setIsLogin(false)}>Sign Up</button>
        <button onClick={() => setIsLogin(true)}>Sign In</button>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          rowGap: "10px",
          border: "solid black 2px",
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        <h2>{isLogin ? "Sign In" : "Sign Up"}</h2>

        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder="Enter Email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <label html="password">Password</label>
        <input
          type="text"
          placeholder="Enter Password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        {!isLogin && (
          <>
            <label html="confirmPassword">Confirm Password</label>
            <input
              type="text"
              placeholder="Enter Password"
              name="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></input>
          </>
        )}
        <button style={{ marginTop: "20px" }}>
          {isLogin ? "Sign In" : "Sign Up"}
        </button>
      </form>
      <button onClick={signInWithGoogle} style={{ marginTop: "40px" }}>
        Sign In With Google
      </button>
    </div>
  );
};

export default Auth;
