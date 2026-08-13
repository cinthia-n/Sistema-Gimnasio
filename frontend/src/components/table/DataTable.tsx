import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  IconButton,
  Box,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export interface Column {
  field: string;
  headerName: string;
  width?: number;
  align?: "left" | "center" | "right";
  render?: (row: any) => React.ReactNode;
}

interface Props {
  columns: Column[];
  rows: any[];

  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
}

export default function DataTable({
  columns,
  rows,
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Paper elevation={3}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  sx={{
                    fontWeight: "bold",
                    background: "#f5f5f5",
                  }}
                >
                  {column.headerName}
                </TableCell>
              ))}

              {(onView || onEdit || onDelete) && (
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    background: "#f5f5f5",
                  }}
                >
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 1}>
                  <Box py={4} textAlign="center">
                    <Typography color="text.secondary">
                      No existen registros.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}

            {rows.map((row, index) => (
              <TableRow
                hover
                key={index}
                sx={{
                  backgroundColor:
                    row.stock !== undefined &&
                    row.minimumStock !== undefined &&
                    row.stock <= row.minimumStock
                      ? "#fff3cd"
                      : undefined,
                }}
              >
                {columns.map((column) => (
                  <TableCell key={column.field}>
                    {column.render
                      ? column.render(row)
                      : row[column.field]}
                  </TableCell>
                ))}

                {(onView || onEdit || onDelete) && (
                  <TableCell align="center">
                    {onView && (
                      <IconButton
                        color="info"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onView(row);
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    )}

                    {onEdit && (
                      <IconButton
                        color="primary"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onEdit(row);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    )}

                    {onDelete && (
                      <IconButton
                        color="error"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onDelete(row);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}