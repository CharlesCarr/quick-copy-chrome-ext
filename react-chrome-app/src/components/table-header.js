import { TableCell, TableHead, TableRow } from "@mui/material";

export default function TableHeader({ type }) {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>Copy Text</TableCell>
        {type != "default" && <TableCell>Category</TableCell>}
        <TableCell align="right">Copy</TableCell>
        <TableCell align="right">Edit</TableCell>
      </TableRow>
    </TableHead>
  );
}
