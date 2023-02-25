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
} from "@mui/material";

const Snippets = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [userSnips, setUserSnips] = useState(true);
  console.log('userSnips', userSnips);

  const [updatedSnip, setUpdatedSnip] = useState(null);
  console.log('updatedSnip', updatedSnip);

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
    console.log("add row clicked");

    setUserSnips([
      ...userSnips,
      {
        category: "",
        id: 1234,
        name: "",
        snip_text: "",
        user_id: user.id,
        edit: true,
      },
    ]);
  };

  const editSaveHandler = async (row) => {
    console.log("row", row);
    console.log(row.edit);

    if (row.edit) {
      // 'Save' is showing

      console.log('row.name', row.name);

      // conditional for whether saving for first time or updating
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

      console.log('data', data);
      console.log('error', error);

      // refetching from Supabase
      getSnips();

      // Now have this saving correctly to Supabase
      // Need to flip the edit state after it has been saved 

      // TODO 2: update existing record

      // will need to send update or addition to Supabase
      console.log("saving");
    } else {
      console.log('editting!!');
      // flip the state to edit being true
      console.log(userSnips);

      const newSnipArr = userSnips.map((snip) => {
        if (snip.id === row.id) {
          snip.edit = true;
        }
        return snip;
      });
      setUserSnips(newSnipArr);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Snippets</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {userSnips.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 450 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Copy Text</TableCell>
                  <TableCell align="right">Category</TableCell>
                  <TableCell align="right">Copy Btn</TableCell>
                  <TableCell align="right">Edit Btn</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userSnips.map((row) => (
                  <TableRow
                    hover
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
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
                    <TableCell
                      align="right"
                      onClick={() => copyText(row.snip_text)}
                    >
                      Copy
                    </TableCell>
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
        ) : (
          <CreateFirstSnip session={session} setUserSnips={setUserSnips} />
        )}
      </div>
    </div>
  );
};

export default Snippets;
