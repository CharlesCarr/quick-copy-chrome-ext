import { TableCell, TableHead, TableRow } from "@mui/material";
import React from "react";

export default function TableHeader({ type }) {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>Copy Text</TableCell>
        {type != "default" && <TableCell align="right">Category</TableCell>}
        <TableCell align="right">Copy</TableCell>
        <TableCell align="right">Edit</TableCell>
      </TableRow>
    </TableHead>
  );
}
