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
} from "@mui/material";
import Header from "../components/header";
import TableHeader from "../components/table-header";

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

  const { user } = session;

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
      alert(`Copied Text! - ${text}`);
      // displayToast(text);
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

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ width: "100vw", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: "40%", border: "1px solid black", padding: "10px" }}>
        <Header />

        <div style={{ display: 'flex', alignItems: "center", justifyContent: "space-between"}}>
          <h1>Snippets</h1>

          <Autocomplete
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                style={{ width: "200px" }}
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

        </div>
        

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {userSnips.length > 0 ? (
            <>
              
              <div style={{ display: "flex", width: "100%" }}>
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
              </div>

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
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.edit ? (
                            <Input
                              placeholder={row.name}
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
                        <TableCell align="right">
                          {row.edit ? (
                            <Input
                              placeholder={row.snip_text}
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
                        <TableCell align="right">
                          {row.edit ? (
                            <Input
                              placeholder={row.category}
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
                            Delete
                          </TableCell>
                        ) : (
                          <TableCell
                            align="right"
                            onClick={() => copyText(row.snip_text)}
                          >
                            Copy
                          </TableCell>
                        )}

                        <TableCell
                          align="right"
                          onClick={() => editSaveHandler(row)}
                        >
                          {row.edit ? "Save" : "Edit"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 5,
                  }}
                >
                  <button onClick={addRowHandler}>Add New Row</button>
                </div>
              </TableContainer>
            </>
          ) : (
            <CreateFirstSnip session={session} setUserSnips={setUserSnips} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Snippets;
