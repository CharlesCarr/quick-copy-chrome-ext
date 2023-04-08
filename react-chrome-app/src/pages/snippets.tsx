import React, { useEffect, useState } from "react";
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
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";
import { TableRowsSharp } from "@mui/icons-material";
import Header from "../components/header";
import TableHeader from "../components/table-header";

interface DefaultSnippetsProps {
  session: any;
}

interface RowInputs {
  name: string;
  snip_text: string;
}

const Alert: any = React.forwardRef(function Alert(props, ref: any) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Snippets = ({ session }: DefaultSnippetsProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userSnips, setUserSnips] = useState<any>(null);
  const [updatedSnip, setUpdatedSnip] = useState<any>(null);
  const [searching, setSearching] = useState<boolean>(false);
  const [displayedSnips, setDisplayedSnips] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [rowCopied, setRowCopied] = useState<string | null>(null);
  const { user } = session;
  const [tabVal, setTabVal] = useState<number>(0);

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
        error: false,
      },
    ]);
  };

  const saveRow = async (row: any) => {
    console.log("row", row);

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
      const newSnipArr = userSnips.map((snip: any) => {
        if (snip.id === row.id) {
          snip.edit = true;
        }
        return snip;
      });
      setUserSnips(newSnipArr);
    }
  };

  const deleteRow = async (row: any) => {
    const { data, error } = await supabase
      .from("snips")
      .delete()
      .eq("id", row.id);

    console.log("data", data);
    console.log("error", error);

    // refetching from Supabase
    getSnips();
  };

  const searchRows = (value: any) => {
    console.log("search val", value);

    setSearching(true);

    const filteredRows = userSnips.filter((row: any) => {
      console.log(row.name);

      return row.name.toUpperCase().includes(value.toUpperCase());
    });

    setDisplayedSnips(filteredRows);
  };

  const categoryClickHandler = (text: any) => {
    console.log(text);
    setSearching(true);

    const filteredRows = userSnips.filter((row: any) => {
      return row.category === text;
    });

    setDisplayedSnips(filteredRows);
  };

  const handleRowClick = (row: any) => {
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

        <Header session={session} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1>Clipboard</h1>

          <Autocomplete
            freeSolo
            id="free-solo-2-demo"
            disableClearable
            sx={{ width: "200px" }}
            // TO DO: fix bug with onClick handle for options
            options={userSnips.map((row: any) => row.name)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search By Name"
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
          <>
            <Box
              sx={{
                width: "100%",
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Tabs
                value={tabVal}
                onChange={(e, newVal) => setTabVal(newVal)}
                aria-label="lab API tabs example"
              >
                <Tab
                  label="All"
                  value={0}
                  onClick={() => setDisplayedSnips(userSnips)}
                />
                {categories.map((cat: any, ind: number) => {
                  return (
                    <Tab
                      key={cat}
                      label={cat}
                      value={ind + 1}
                      onClick={() => categoryClickHandler(cat)}
                    />
                  );
                })}
              </Tabs>
            </Box>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 450 }} aria-label="simple table">
                <TableHeader type="loggedIn" />
                <TableBody>
                  {displayedSnips.map((row: any) => (
                    <TableRow
                      hover={!row.error && true}
                      key={row.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        cursor: "pointer",
                        backgroundColor: row.error && "#ff726f",
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
          </>
        </Box>
      </Box>
    </Box>
  );
};

export default Snippets;
