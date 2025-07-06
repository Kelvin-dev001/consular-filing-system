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
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import EditRegistrationDialog from "./EditRegistrationDialog";

export default function RegistrationsTable() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // For Edit dialog
  const [editReg, setEditReg] = useState(null);

  // Fetch data
  const fetchRecords = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/registrations", {
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
  const handleView = (id) => {
    alert("View: " + id);
  };
  const handleEdit = (id) => {
    const reg = records.find((r) => r._id === id);
    setEditReg(reg);
  };
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      axios
        .delete(`http://localhost:5000/api/registrations/${id}`)
        .then(() => {
          setRecords((prev) => prev.filter((r) => r._id !== id));
        });
    }
  };
  const handleDownload = (row) => {
    alert("Download/Print: " + row.fullName);
  };

  const columns = [
    {
      field: "fullName",
      headerName: "Full Name",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "fileNumber",
      headerName: "Form Number",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "passportOrIdNumber",
      headerName: "Passport/ID Number",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 210,
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            <Tooltip title="View">
              <VisibilityIcon />
            </Tooltip>
          }
          label="View"
          onClick={() => handleView(params.id)}
        />,
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
        <GridActionsCellItem
          icon={
            <Tooltip title="Download/Print">
              <DownloadIcon />
            </Tooltip>
          }
          label="Download"
          onClick={() => handleDownload(params.row)}
        />,
      ],
    },
  ];

  return (
    <Paper sx={{ p: 3, maxWidth: 1200, mx: "auto", mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Consular Registrations
      </Typography>
      <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
        <TextField
          label="Search by Name, Form Number, Passport"
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
      <EditRegistrationDialog
        open={!!editReg}
        onClose={() => setEditReg(null)}
        registration={editReg}
        onSave={() => {
          setEditReg(null);
          fetchRecords();
        }}
      />
    </Paper>
  );
}