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
} from "@mui/material";

const Snippets = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [userSnips, setUserSnips] = useState(true);
  console.log(userSnips);

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
        setUserSnips(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.snip_text}</TableCell>
                    <TableCell align="right">{row.category}</TableCell>
                    <TableCell align="right">Copy</TableCell>
                    <TableCell align="right">Edit</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell>Add New Row</TableCell>
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
