import { TableCell, TableHead, TableRow } from "@mui/material";
import React from "react";

export default function TableHeader() {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell align="right">Copy Text</TableCell>
        <TableCell align="right">Category</TableCell>
        <TableCell align="right">Copy Btn</TableCell>
        <TableCell align="right">Edit Btn</TableCell>
      </TableRow>
    </TableHead>
  );
}
