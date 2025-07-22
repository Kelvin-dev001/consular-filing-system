import React, { useEffect, useState, useRef } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import EditRegistrationDialog from "./EditRegistrationDialog";
import RegistrationFormPrintable from "./RegistrationFormPrintable";
import API from "../../utils/api";

export default function RegistrationsTable() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // For Edit dialog
  const [editReg, setEditReg] = useState(null);

  // For Print Dialog
  const [printReg, setPrintReg] = useState(null);
  const printRef = useRef();

  // Fetch data
  const fetchRecords = () => {
    setLoading(true);
    API
      .get("/registrations", {
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
      API
        .delete(`/registrations/${id}`)
        .then(() => {
          setRecords((prev) => prev.filter((r) => r._id !== id));
        });
    }
  };

  // Print handler: opens dialog with printable content
  const handlePrint = (row) => {
    setPrintReg(row);
  };

  // Download handler: opens new print window with registration info (uses printable form)
  const handleDownload = (row) => {
    const printWindow = window.open("", "", "height=900,width=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>Registration Form - ${row.fullName}</title>
          <link rel="stylesheet" href="/RegistrationFormPrintable.module.css" />
        </head>
        <body>
          <div id="print-root"></div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    // You could use ReactDOMServer.renderToString here for full SSR, but that's more advanced.
    // For now, encourage user to use Print dialog for correct printout.
  };

  const columns = [
    { field: "fullName", headerName: "Full Name", flex: 1, minWidth: 120 },
    { field: "fileNumber", headerName: "Form Number", flex: 1, minWidth: 100 },
    { field: "passportOrIdNumber", headerName: "Passport/ID Number", flex: 1, minWidth: 140 },
    { field: "countryPlaceOfBirth", headerName: "Place of Birth", flex: 1, minWidth: 120 },
    {
      field: "birthDate",
      headerName: "Birth Date",
      flex: 1,
      minWidth: 120,
      valueGetter: (params) =>
        params?.row?.birthDate
          ? new Date(params.row.birthDate).toLocaleDateString()
          : "",
    },
    { field: "maritalStatus", headerName: "Marital Status", flex: 1, minWidth: 120 },
    { field: "profession", headerName: "Profession", flex: 1, minWidth: 120 },
    { field: "residenceKenya", headerName: "Residence (Kenya)", flex: 1, minWidth: 140 },
    { field: "residenceMozambique", headerName: "Residence (Mozambique)", flex: 1, minWidth: 140 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 230,
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
            <Tooltip title="Download">
              <DownloadIcon />
            </Tooltip>
          }
          label="Download"
          onClick={() => handleDownload(params.row)}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="Print">
              <PrintIcon />
            </Tooltip>
          }
          label="Print"
          onClick={() => handlePrint(params.row)}
        />,
      ],
    },
  ];

  // Printable content dialog
  const PrintDialog = () => (
    <Dialog
      open={!!printReg}
      onClose={() => setPrintReg(null)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Print Registration Form
        <IconButton
          aria-label="close"
          onClick={() => setPrintReg(null)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent ref={printRef}>
        {printReg && (
          <Box sx={{ mt: 2 }}>
            {/* Use the up-to-date printable form */}
            <RegistrationFormPrintable form={printReg} ref={printRef} />
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <button
                onClick={() => {
                  const printContents = printRef.current.innerHTML;
                  const printWindow = window.open('', '', 'height=900,width=800');
                  printWindow.document.write(`
                    <html>
                      <head>
                        <title>Print Registration</title>
                        <link rel="stylesheet" href="/RegistrationFormPrintable.module.css" />
                        <style>
                          body { font-family: Arial, sans-serif; }
                        </style>
                      </head>
                      <body>
                        ${printContents}
                      </body>
                    </html>
                  `);
                  printWindow.document.close();
                  printWindow.focus();
                  printWindow.print();
                }}
                style={{
                  padding: "10px 24px",
                  fontSize: "1rem",
                  background: "#1976d2",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                <PrintIcon style={{ verticalAlign: "middle", marginRight: 8 }} />
                Print
              </button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );

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
      {PrintDialog()}
    </Paper>
  );
}