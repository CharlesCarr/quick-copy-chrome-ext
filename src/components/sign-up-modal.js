import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";
import { signInWithGoogle } from "../utils/supabase-utils";
import SupaAuth from "./supa-auth";

export default function SignUpModal({ showSignUpModal, setShowSignUpModal }) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={showSignUpModal}
      onClose={() => setShowSignUpModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" sx={{ fontSize: 20 }} align="center">
          multi-copy-ext
        </Typography>
        <SupaAuth />
        {/* <Typography id="modal-modal-title" variant="h3" component="h3">
          Sign Up
        </Typography>

        <Container>
          <TextField id="filled-basic" label="Username" variant="filled" />
          <TextField id="filled-basic" label="Password" variant="filled" />
          <TextField id="filled-basic" label="Confirm Password" variant="filled" />
        </Container>

        <Button onClick={signInWithGoogle}>Sign Up W/ Google</Button> */}
      </Box>
    </Modal>
  );
}
