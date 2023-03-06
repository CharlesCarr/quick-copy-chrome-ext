import React, { useState } from "react";
import { supabase } from "../config/supabase-client";
// MUI Components
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Input,
} from "@mui/material";
import Header from "../components/header";
import TableHeader from "../components/table-header";

const defaultSnips = [
  {
    id: 1,
    name: "Example Email",
    snip_text: "email@example.com",
    edit: false,
  },
  {
    id: 2,
    name: "Example LinkedIn Profile URL",
    snip_text: "https://www.linkedin.com/in/exampleuser/",
    edit: false,
  },
  {
    id: 3,
    name: "Example GitHub Profile URL",
    snip_text: "https://github.com/ExampleUser",
    edit: false,
  },
];

const DefaultSnippets = () => {
  const [userSnips, setUserSnips] = useState(defaultSnips);
  //   const [displayedSnips, setDisplayedSnips] = useState(true);
  const [updatedSnip, setUpdatedSnip] = useState(null);
//   const { user } = session;

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

  const editSaveHandler = (row) => {
    console.log("edit / saving");
    console.log("row", row);

    if (row.edit) {
      // conditional for whether saving for first time or updating
      // 1234 is hardcoded in when creating new
      if (row.id === 1234) {
        // TODO 1: save for first time
        setUserSnips([
          ...userSnips,
          {
            id: Math.random() * 10,
            name: updatedSnip.name,
            snip_text: updatedSnip.snip_text,
            edit: false,
          },
        ]);
      } else {
        // think can prob use the id of the row to check whether it is a new row or we are updating existing
        // TODO 2: update existing record
        const updatedUserSnips = userSnips.map((snip) => {
          if (row.id === snip.id) {
            snip.name = updatedSnip.name || row.name;
            snip.snip_text = updatedSnip.snip_text || row.snip_text;
          }
          return snip;
        });
        console.log(updatedUserSnips);
        setUserSnips(updatedUserSnips);
      }
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

  const deleteRow = (row) => {
    console.log(`deleting row ${row}`);
  };

  return (
    <div
      style={{
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "40%", border: "1px solid black", padding: "10px" }}>
        <Header />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1>Snippets</h1>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 450 }} aria-label="simple table">
              <TableHeader />

              <TableBody>
                {userSnips.map((row) => (
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
                      <TableCell align="right" onClick={() => deleteRow(row)}>
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
        </div>
      </div>
    </div>
  );
};

export default DefaultSnippets;
