import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { supabase } from "../config/supabase-client";

const Profile = ({ session }) => {
  const [activeUser, setActiveUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  console.log(activeUser);
  console.log(profileData);
  const [username, setUsername] = useState(null);
  const [fullName, setFullName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (activeUser) {
      getProfileInfo(activeUser.id);
    }
  }, [activeUser]);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setActiveUser(user);
  };

  const getProfileInfo = async (id) => {
    let { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id);

    if (error) {
      console.error(error);
    }

    if (profiles) {
      setProfileData(profiles[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(activeUser.id);
    console.log(fullName);
    console.log(username);

    const finalFullName = fullName || profileData.full_name;
    const finalUsername = username || profileData.username;
    // const time = new Date();
    // console.log(time);

    const { data, error } = await supabase
      .from("profiles")
      // TO DO: update 'updated_at' col w/ current time
      .update({ username: finalUsername, full_name: finalFullName })
      .eq("id", activeUser.id)
      .select();

    if (error) {
      console.error(error);
    }

    if (data) {
      console.log(data);
    }
  };

  const handleDelete = async () => {
    alert("delete coming soon");
    // TO DO: Add confirmation modal w/ GitHub like functionality

    // const { data, error } = await supabase.auth.admin.deleteUser(activeUser.id);

    // if (error) {
    //   console.error(error);
    // }

    // if (data) {
    //   console.log(data);
    // }

    // const { data, error } = await supabase
    //   .from("profiles")
    //   .delete()
    //   .eq("id", activeUser.id);

    // if (error) {
    //   console.error(error);
    // }

    // if (data) {
    //   console.log(data);
    // }

    // let { error: signOuterr } = await supabase.auth.signOut();

    // if (signOuterr) {
    //   console.error(signOuterr);
    // }

    navigate("/");
  };

  if (!profileData) return <p>No profile data yet..</p>;

  return (
    <Box
      sx={{
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", padding: "10px" }}>
        <Header session={session} />

        <Typography variant="h4" align="center">
          User Profile
        </Typography>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            rowGap: "10px",
            // border: "solid black 2px",
            // borderRadius: "10px",
            padding: "20px",
          }}
        >
          <Avatar
            alt="User Avatar"
            src={profileData.avatar_url}
            sx={{ width: 100, height: 100 }}
          />
          <Typography>{activeUser.email}</Typography>

          <TextField
            id="full_name"
            label="Full Name"
            variant="filled"
            defaultValue={profileData.full_name}
            onChange={(e) => setFullName(e.target.value)}
          />

          <TextField
            id="username"
            label="Username"
            variant="filled"
            defaultValue={profileData.username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <Button onClick={handleDelete} variant="outlined" color="error">
              Delete
            </Button>
            <Button type="submit" variant="contained">
              Update
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Profile;
