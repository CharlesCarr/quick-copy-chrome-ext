import SignUpModal from "./sign-up-modal";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useEffect, useState } from "react";
import { AppBar, Avatar, Box, Button, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Typography } from "@mui/material";

interface HeaderProps {
  session: any,
  showSignUpModal?: any,
  setShowSignUpModal?: any
}

export default function Header({
  session,
  showSignUpModal,
  setShowSignUpModal,
}: HeaderProps) {
  const [userAvatar, setUserAvatar] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // TO DO: change to using the user profile rather than the session data
    if (session && session.user.user_metadata.avatar_url) {
      console.log(session);
      console.log(session.user.user_metadata.avatar_url);
      setUserAvatar(session.user.user_metadata.avatar_url);
      setUserEmail(session.user.email);
    }
  }, [session]);

  const clickHandler = () => {
    if (session) {
      navigate("/snippets");
    } else {
      navigate("/");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "50px",
        display: "flex",
        alignItems: "center",
        marginTop: "20px",
        marginBottom: "20px",
      }}
    >
      <AppBar position="static" sx={{ borderRadius: "10px" }}>
        <Toolbar>
          <Box
            sx={{
              flexGrow: "1",
              display: "flex",
              gap: "15px",
              alignItems: "center",
            }}
          >
            <ContentCopyIcon
              color="primary"
              sx={{ cursor: "pointer" }}
              onClick={() => clickHandler()}
            />
            <Typography sx={{ fontSize: 20 }} onClick={() => clickHandler()}>
              Multi-Copy-Ext
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {!session ? (
              <>
                <Button
                  variant="text"
                  onClick={() => setShowSignUpModal(true)}
                  sx={{ fontSize: 12, cursor: "pointer", fontWeight: "bold" }}
                >
                  Sign In/Up
                </Button>
                <SignUpModal
                  showSignUpModal={showSignUpModal}
                  setShowSignUpModal={setShowSignUpModal}
                />
              </>
            ) : (
              <Typography
                onClick={() => navigate("/snippets")}
                sx={{ fontSize: 12, cursor: "pointer" }}
              >
                {userEmail}
              </Typography>
            )}
            {!userAvatar ? (
              <AccountCircleIcon
                sx={{ width: 40, height: 40 }}
                color="primary"
              />
            ) : (
              <Avatar
                alt="User Avatar"
                src={userAvatar}
                sx={{ width: 40, height: 40, cursor: "pointer" }}
                onClick={() => navigate("/profile")}
              />
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
