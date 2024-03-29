import React, { useEffect, useState } from "react";
import { supabase } from "../config/supabase-client";
// MUI Components
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Input,
  Button,
  Snackbar,
  IconButton,
  Divider,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";
import TableHeader from "../components/table-header";
import Header from "../components/header";

const defaultSnips = [
  {
    id: 1,
    name: "Email",
    snip_text: "email@example.com",
    edit: false,
    error: false,
  },
  {
    id: 2,
    name: "LinkedIn Profile URL",
    snip_text: "https://www.linkedin.com/in/exampleuser/",
    edit: false,
    error: false,
  },
  {
    id: 3,
    name: "GitHub Profile URL",
    snip_text: "https://github.com/ExampleUser",
    edit: false,
    error: false,
  },
];

const Alert: any = React.forwardRef(function Alert(props, ref: any) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface DefaultSnippetsProps {
  session: any;
}

interface RowInputs {
  name: string;
  snip_text: string;
}

const DefaultSnippets = ({ session }: DefaultSnippetsProps) => {
  const [userSnips, setUserSnips] = useState<any>(defaultSnips);
  const [updatedSnip, setUpdatedSnip] = useState<RowInputs>({
    name: "",
    snip_text: "",
  });
  const [showSignUpModal, setShowSignUpModal] = useState<any>(true);
  const [activeUser, setActiveUser] = useState<any>(null);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState<boolean>(false);
  const [rowCopied, setRowCopied] = useState<string | null>(null);
  const [inputError, setInputError] = useState(false);

  useEffect(() => {
    getUser();

    if (activeUser) {
      navigate("/snippets");
    }
  }, [activeUser]);

  const getUser = async () => {
    const {
      data: { user },
    }: any = await supabase.auth.getUser();
    setActiveUser(user);
  };

  const copyText = async (text: string) => {
    console.log(text);
    try {
      await navigator.clipboard.writeText(text);
      // Alert the copied text
      // alert(`Copied Text! - ${text}`);
      setRowCopied(text);
      setShowToast(true);
    } catch (err) {
      console.error(`Failed to Copy - ${err}`);
      alert(`Failed to Copy - ${err}`);
    }
  };

  const addRowHandler = () => {
    if (userSnips.length === 6) {
      // TO DO: Build modal for signing up
      setShowSignUpModal(true);
      // alert("Signup!!");
      return;
    }

    setUserSnips([
      ...userSnips,
      {
        id: 1234,
        name: "",
        snip_text: "",
        // think adding something to differentiate 'new' vs. 'update'
        edit: true,
      },
    ]);
  };

  const saveRow = (row: any) => {
    console.log(row);
    console.log(userSnips);

    console.log("***updatedSnip", updatedSnip);

    if (row.edit) {
      // Check for blank inputs
      if (!updatedSnip.name || !updatedSnip.snip_text) {
        console.log("Invalid Inputs");
        // alert("Invalid Row!!");
        // setInputError(true);
        const snipsContainErr = userSnips.map((snip: any) => {
          if (snip.id === row.id) {
            snip = {
              id: snip.id,
              name: snip.name,
              snip_text: snip.snip_text,
              edit: true,
              error: true,
            };
          }
          return snip;
        });
        setUserSnips(snipsContainErr);

        return;
      }

      // Saving for first time
      if (row.id === 1234) {
        const updatedSnips = userSnips.map((snip: any) => {
          if (snip.id === 1234) {
            snip = {
              id: Math.random() * 10,
              name: updatedSnip?.name,
              snip_text: updatedSnip?.snip_text,
              edit: false,
              error: false,
            };
            return snip;
          }
          return snip;
        });
        console.log("updatedSnips", updatedSnips);
        setUserSnips(updatedSnips);
      } else {
        console.log("UPDATING");
        console.log("row", row);
        // TODO 2: update existing record
        const updatedUserSnips = userSnips.map((snip: any) => {
          if (row.id === snip.id) {
            console.log(snip.name);
            console.log(updatedSnip);
            snip.name = updatedSnip ? updatedSnip.name : snip.name;
            console.log(snip.name);
            snip.snip_text = updatedSnip
              ? updatedSnip.snip_text
              : snip.snip_text;
            snip.edit = false;
            snip.error = false;
          }
          return snip;
        });
        console.log(updatedUserSnips);
        setUserSnips(updatedUserSnips);
      }
    } else {
      // flip the state to edit being true
      const newSnipArr = userSnips.map((snip: any) => {
        if (snip.id === row.id) {
          snip.edit = true;
        }
        return snip;
      });
      setUserSnips(newSnipArr);
    }

    // setUpdatedSnip({
    //   name: "",
    //   snip_text: "",
    // });
  };

  const deleteRow = (row: any) => {
    // flip the state to edit being true
    const newSnipArr = userSnips.filter((snip: any) => {
      return snip.id !== row.id;
    });

    setUserSnips(newSnipArr);
  };

  const handleRowClick = (row: any) => {
    if (!row.edit) {
      copyText(row.snip_text);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", padding: "20px" }}>
        <Snackbar
          open={showToast}
          autoHideDuration={3000}
          onClose={() => setShowToast(false)}
        >
          <Alert
            onClose={() => setShowToast(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {`"${rowCopied}" Copied!`}
          </Alert>
        </Snackbar>

        <Header
          session={session}
          showSignUpModal={showSignUpModal}
          setShowSignUpModal={setShowSignUpModal}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* elevation={3} */}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 450 }} aria-label="simple table">
              <TableHeader type="default" />

              <TableBody>
                {userSnips.map((row: any) => (
                  <TableRow
                    hover={!row.error && true}
                    key={row.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                      backgroundColor: row.error && "#ff726f",
                    }}
                    // {`${row.error} && background: "red"`}
                    onClick={() => handleRowClick(row)}
                  >
                    <TableCell component="th" scope="row" sx={{ fontSize: 12 }}>
                      {row.edit ? (
                        <Input
                          placeholder={row.name}
                          defaultValue={row.name}
                          color="error"
                          onChange={(e) =>
                            setUpdatedSnip({
                              ...updatedSnip,
                              name: e.target.value,
                            })
                          }
                        ></Input>
                      ) : (
                        row.name
                      )}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12 }}>
                      {row.edit ? (
                        <Input
                          placeholder={row.snip_text}
                          defaultValue={row.snip_text}
                          onChange={(e) =>
                            setUpdatedSnip({
                              ...updatedSnip,
                              snip_text: e.target.value,
                            })
                          }
                        ></Input>
                      ) : (
                        row.snip_text
                      )}
                    </TableCell>

                    {row.edit ? (
                      <TableCell align="right" onClick={() => deleteRow(row)}>
                        <IconButton aria-label="copy" size="medium">
                          <DeleteIcon
                            sx={{ color: "red" }}
                            fontSize="inherit"
                          />
                        </IconButton>
                      </TableCell>
                    ) : (
                      <TableCell
                        align="right"
                        onClick={() => copyText(row.snip_text)}
                      >
                        <IconButton aria-label="copy" size="medium">
                          <ContentCopyIcon
                            // sx={{ cursor: "pointer" }}
                            color="primary"
                            fontSize="inherit"
                          />
                        </IconButton>
                      </TableCell>
                    )}

                    <TableCell align="right" onClick={() => saveRow(row)}>
                      {row.edit ? (
                        <IconButton aria-label="copy" size="medium">
                          <SaveIcon color="primary" fontSize="inherit" />
                        </IconButton>
                      ) : (
                        <IconButton aria-label="copy" size="medium">
                          <EditIcon color="primary" fontSize="inherit" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Divider />
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingX: 5,
                paddingY: 4,
              }}
            >
              <Button
                onClick={addRowHandler}
                variant="contained"
                sx={{ width: "100%" }}
                color="primary"
              >
                Add New Row
              </Button>
            </Box>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default DefaultSnippets;
