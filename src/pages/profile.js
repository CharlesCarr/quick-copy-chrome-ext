import React from "react";

const Profile = () => {
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { data, error } = await signInWithPassword(email, password);
//       if (error) throw new Error(error);
//       console.log(data);
//       console.log("User ID", data.user.id);
//       // navigate("/");
//     } catch (err) {
//       console.error(err);
//     }
//   };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>PROFILE PAGE</h1>

      <form
        // onSubmit={handleSubmit}
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
        <h2>Account Details</h2>

        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder="Enter Email"
          name="email"
          //   onChange={(e) => setEmail(e.target.value)}
        ></input>
        <label html="password">Password</label>
        <input
          type="text"
          placeholder="Enter Password"
          name="password"
          //   onChange={(e) => setPassword(e.target.value)}
        ></input>

        <button style={{ marginTop: "20px" }}>Update</button>
      </form>

        {/* onClick={} */}
      <button  style={{ marginTop: "40px" }}>Delete Account</button>
    </div>
  );
};

export default Profile;
