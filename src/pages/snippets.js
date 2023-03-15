import React, { useEffect, useState } from "react";
import CreateFirstSnip from "../components/create-first-snip";
import Snip from "../components/snip";
import { supabase } from "../config/supabase-client";
// MUI Components
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  Input,
  Autocomplete,
  TextField,
  Box,
  Snackbar,
  Button,
  Divider,
  IconButton,
  Tab,
  Tabs,
} from "@mui/material";
import Header from "../components/header";
import TableHeader from "../components/table-header";
import { useNavigate } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";
import { TableRowsSharp } from "@mui/icons-material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Snippets = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [userSnips, setUserSnips] = useState(true);
  console.log("userSnips", userSnips);
  const [updatedSnip, setUpdatedSnip] = useState(null);
  console.log("updatedSnip", updatedSnip);
  const [searching, setSearching] = useState(false);
  const [displayedSnips, setDisplayedSnips] = useState([]);
  console.log(displayedSnips);
  const [categories, setCategories] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [rowCopied, setRowCopied] = useState(null);
  const { user } = session;
  const [tabVal, setTabVal] = useState(1);

  // Need function for getting snips for the user
  useEffect(() => {
    getSnips();
  }, []);

  const getSnips = async () => {
    try {
      setLoading(true);
      const { user } = session;

      let { data, error, status } = await supabase
        .from("snips")
        .select(`id, user_id, snip_text, name, category`)
        .eq("user_id", user.id);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        console.log("DATA RETURNED", data);
        const tableData = data.map((d) => {
          return {
            ...d,
            edit: false,
          };
        });
        console.log("tableData", tableData);
        setUserSnips(tableData);
        setDisplayedSnips(tableData);

        const allCategories = data.map((d) => {
          return d.category;
        });
        console.log("allCats", allCategories);
        const uniqueCategoriesSet = new Set(allCategories);
        const uniqueCategories = Array.from(uniqueCategoriesSet);
        console.log("uniqueCategories", uniqueCategories);
        setCategories(uniqueCategories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyText = async (text) => {
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
    setSearching(false);

    setDisplayedSnips([
      ...userSnips,
      {
        category: "",
        id: 1234,
        name: "",
        snip_text: "",
        user_id: user.id,
        // think adding something to differentiate 'new' vs. 'update'
        edit: true,
      },
    ]);
  };

  const editSaveHandler = async (row) => {
    console.log("row", row);

    if (row.edit) {
      // conditional for whether saving for first time or updating
      // 1234 is hardcoded in when creating new
      if (row.id === 1234) {
        // TODO 1: save for first time
        const { data, error } = await supabase
          .from("snips")
          .insert({
            user_id: user.id,
            name: updatedSnip.name,
            snip_text: updatedSnip.snip_text,
            category: updatedSnip.category,
          })
          .select();

        console.log("data", data);
        console.log("error", error);
      } else {
        // think can prob use the id of the row to check whether it is a new row or we are updating existing
        // TODO 2: update existing record
        const { data, error } = await supabase
          .from("snips")
          .update({
            name: updatedSnip.name ? updatedSnip.name : row.name,
            snip_text: updatedSnip.snip_text
              ? updatedSnip.snip_text
              : row.snip_text,
            category: updatedSnip.category
              ? updatedSnip.category
              : row.category,
          })
          .eq("id", row.id);

        console.log("data", data);
        console.log("error", error);
      }
      // refetching from Supabase
      getSnips();
    } else {
      // flip the state to edit being true
      const newSnipArr = userSnips.map((snip) => {
        if (snip.id === row.id) {
          snip.edit = true;
        }
        return snip;
      });
      setUserSnips(newSnipArr);
    }
  };

  const deleteRow = async (row) => {
    const { data, error } = await supabase
      .from("snips")
      .delete()
      .eq("id", row.id);

    console.log("data", data);
    console.log("error", error);

    // refetching from Supabase
    getSnips();
  };

  const searchRows = (value) => {
    setSearching(true);

    const filteredRows = userSnips.filter((row) => {
      return row.name.toUpperCase().includes(value.toUpperCase());
    });

    setDisplayedSnips(filteredRows);
  };

  const categoryClickHandler = (text) => {
    console.log(text);
    setSearching(true);

    const filteredRows = userSnips.filter((row) => {
      return row.category === text;
    });

    setDisplayedSnips(filteredRows);
  };

  const handleRowClick = (row) => {
    if (!row.edit) {
      copyText(row.snip_text);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Box
      sx={{
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "50%", border: "1px solid #b2b2b2", padding: "20px" }}>
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

        <Header session={session} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1>Snippets</h1>

          <Autocomplete
            freeSolo
            id="free-solo-2-demo"
            disableClearable
            sx={{ width: "200px" }}
            options={userSnips.map((row) => row.name)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search input"
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                }}
                onChange={(e) => searchRows(e.target.value)}
              />
            )}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {userSnips.length > 0 ? (
            <>
              {/* <Box sx={{ display: "flex", width: "100%" }}>
                <button onClick={() => setDisplayedSnips(userSnips)}>
                  All
                </button>
                {categories.map((category) => (
                  <button
                    onClick={(e) => categoryClickHandler(e.target.innerHTML)}
                  >
                    {category}
                  </button>
                ))}
              </Box> */}
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={tabVal}
                  onChange={(e, newVal) => setTabVal(newVal)}
                  aria-label="lab API tabs example"
                >
                  <Tab label="All" value={0} />
                  <Tab label="Item One" value={1} />
                  <Tab label="Item Two" value={2} />
                  <Tab label="Item Three" value={3} />
                </Tabs>
              </Box>

              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 450 }} aria-label="simple table">
                  <TableHeader />
                  <TableBody>
                    {displayedSnips.map((row) => (
                      <TableRow
                        hover
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          cursor: "pointer",
                        }}
                        onClick={() => handleRowClick(row)}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ fontSize: 12 }}
                        >
                          {row.edit ? (
                            <Input
                              placeholder={row.name}
                              defaultValue={row.name}
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
                        <TableCell defaultValue={row.snip_text}>
                          {row.edit ? (
                            <Input
                              placeholder={row.category}
                              defaultValue={row.category}
                              onChange={(e) =>
                                setUpdatedSnip({
                                  ...updatedSnip,
                                  category: e.target.value,
                                })
                              }
                            ></Input>
                          ) : (
                            row.category
                          )}
                        </TableCell>

                        {row.edit ? (
                          <TableCell
                            align="right"
                            onClick={() => deleteRow(row)}
                          >
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
                                color="primary"
                                fontSize="inherit"
                              />
                            </IconButton>
                          </TableCell>
                        )}

                        <TableCell
                          align="right"
                          onClick={() => editSaveHandler(row)}
                        >
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
            </>
          ) : (
            <CreateFirstSnip session={session} setUserSnips={setUserSnips} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Snippets;
