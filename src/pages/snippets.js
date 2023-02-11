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
  console.log(userSnips);

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
        category: "new",
        id: 7,
        name: "new-test",
        snip_text: "new-test-text",
        user_id: user.id,
        edit: true,
      },
    ]);
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
          // userSnips.map((d) => {
          //   return <Snip key={d.id} data={d} />;
          // })
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
                      {row.edit ? <Input></Input> : row.name}
                    </TableCell>
                    <TableCell align="right">
                      {row.edit ? <Input></Input> : row.snip_text}
                    </TableCell>
                    <TableCell align="right">
                      {row.edit ? <Input></Input> : row.category}
                    </TableCell>
                    <TableCell
                      align="right"
                      onClick={() => copyText(row.snip_text)}
                    >
                      Copy
                    </TableCell>
                    <TableCell align="right">
                      {row.edit ? "Edit" : "Save"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow hover>
                  <TableCell onClick={addRowHandler}>Add New Row</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        ) : (
          <CreateFirstSnip session={session} setUserSnips={setUserSnips} />
        )}
      </div>
    </div>
  );
};

export default Snippets;
