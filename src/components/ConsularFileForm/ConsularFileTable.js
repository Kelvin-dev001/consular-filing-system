import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridToolbar,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import {
  Paper,
  Box,
  Typography,
  Tooltip,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import EditConsularFileDialog from "./EditConsularFileDialog";

export default function ConsularFileTable() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // For Edit dialog
  const [editCons, setEditCons] = useState(null);

  // Fetch data
  const fetchRecords = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/consular-files", {
        params: {
          page: page + 1,
          limit: pageSize,
          search: search,
        },
      })
      .then((res) => {
        setRecords(res.data.records);
        setRowCount(res.data.total);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line
  }, [page, pageSize, search]);

  // Handlers for actions
  const handleEdit = (id) => {
    const file = records.find((r) => r._id === id);
    setEditCons(file);
  };
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      axios
        .delete(`http://localhost:5000/api/consular-files/${id}`)
        .then(() => {
          setRecords((prev) => prev.filter((r) => r._id !== id));
        });
    }
  };

  // Adjusted columns to match existing data fields
  const columns = [
    {
      field: "fileNumber",
      headerName: "File Number",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "openedOn",
      headerName: "Opened On",
      flex: 1,
      minWidth: 120,
      valueGetter: (params) =>
        params.value
          ? new Date(params.value).toLocaleDateString()
          : "",
    },
    {
      field: "observations",
      headerName: "Observations",
      flex: 2,
      minWidth: 180,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            <Tooltip title="Edit">
              <EditIcon />
            </Tooltip>
          }
          label="Edit"
          onClick={() => handleEdit(params.id)}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="Delete">
              <DeleteIcon color="error" />
            </Tooltip>
          }
          label="Delete"
          onClick={() => handleDelete(params.id)}
        />,
      ],
    },
  ];

  return (
    <Paper sx={{ p: 3, maxWidth: 1200, mx: "auto", mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Consular Files
      </Typography>
      <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
        <TextField
          label="Search by File Number, Name, Observations"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 350 }}
        />
      </Box>
      <DataGrid
        rows={records}
        columns={columns}
        getRowId={(row) => row._id}
        rowCount={rowCount}
        page={page}
        pageSize={pageSize}
        pagination
        paginationMode="server"
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newSize) => setPageSize(newSize)}
        loading={loading}
        autoHeight
        components={{
          Toolbar: GridToolbar,
        }}
        sx={{
          "& .MuiDataGrid-actionsCell": { justifyContent: "center" },
        }}
      />
      <EditConsularFileDialog
        open={!!editCons}
        onClose={() => setEditCons(null)}
        consularFile={editCons}
        onSave={() => {
          setEditCons(null);
          fetchRecords();
        }}
      />
    </Paper>
  );
}