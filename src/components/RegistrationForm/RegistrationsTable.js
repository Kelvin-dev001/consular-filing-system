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
  Avatar,
  Divider
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import EditRegistrationDialog from "./EditRegistrationDialog";
import API from "../../../utils/api"; // <-- Correct import path for your project

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

  // Download handler: opens new print window with registration info
  const handleDownload = (row) => {
    const getFamilyTable = (familyArr, title, showAgeType) => {
      if (!familyArr || !familyArr.length) return "";
      return `
        <h4>${title}</h4>
        <table>
          <tr>
            <th>Name</th>
            <th>Relationship</th>
            <th>Age</th>
            <th>Residence</th>
          </tr>
          ${familyArr
            .map(
              (fm) =>
                `<tr>
                  <td>${fm.name || ""}</td>
                  <td>${fm.relationship || ""}</td>
                  <td>${fm.age ? `${fm.age} ${showAgeType && fm.ageType === "months" ? "months" : "years"}` : ""}</td>
                  <td>${fm.residence || ""}</td>
                </tr>`
            )
            .join("")}
        </table>
        <br/>
      `;
    };

    const spouse = row.spouse
      ? `
        <h4>Spouse Details</h4>
        <table>
          <tr><th>Full Name</th><td>${row.spouse.fullName || ""}</td></tr>
          <tr><th>Nationality</th><td>${row.spouse.nationality || ""}</td></tr>
          <tr><th>ID Document</th><td>${row.spouse.idDocument || ""}</td></tr>
          <tr><th>Profession</th><td>${row.spouse.profession || ""}</td></tr>
          <tr><th>Workplace</th><td>${row.spouse.workplace || ""}</td></tr>
          <tr><th>Cell Phone</th><td>${row.spouse.cellPhone || ""}</td></tr>
        </table>
        <br/>
      `
      : "";

    const familyMoz = getFamilyTable(row.familyMozambique, "Family in Mozambique", false);
    const familyU15 = getFamilyTable(row.familyUnder15, "Family Under 15", true);

    const printContent = `
      <html>
        <head>
          <title>Registration Form - ${row.fullName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; }
            h2, h4 { text-align: center; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 16px;}
            td, th { border: 1px solid #222; padding: 8px; }
            .avatar { display: block; margin: 0 auto 16px auto; width: 120px; height: 120px; border-radius: 50%; object-fit: cover;}
          </style>
        </head>
        <body>
          <h2>Consular Registration Form</h2>
          ${
            row.passportPhoto
              ? `<img src="${row.passportPhoto}" alt="Passport Photo" class="avatar"/>`
              : ""
          }
          <table>
            <tr><th>Full Name</th><td>${row.fullName || ""}</td></tr>
            <tr><th>Form Number</th><td>${row.fileNumber || ""}</td></tr>
            <tr><th>Country/Place of Birth</th><td>${row.countryPlaceOfBirth || ""}</td></tr>
            <tr><th>Birth Date</th><td>${row.birthDate ? new Date(row.birthDate).toLocaleDateString() : ""}</td></tr>
            <tr><th>Marital Status</th><td>${row.maritalStatus || ""}</td></tr>
            <tr><th>Profession</th><td>${row.profession || ""}</td></tr>
            <tr><th>Education</th><td>${row.education || ""}</td></tr>
            <tr><th>Workplace/School</th><td>${row.workplaceOrSchool || ""}</td></tr>
            <tr><th>Phone</th><td>${row.phone || ""}</td></tr>
            <tr><th>Cell Phone</th><td>${row.cellPhone || ""}</td></tr>
            <tr><th>Father's Name</th><td>${row.fatherName || ""}</td></tr>
            <tr><th>Mother's Name</th><td>${row.motherName || ""}</td></tr>
            <tr><th>Passport/ID Number</th><td>${row.passportOrIdNumber || ""}</td></tr>
            <tr><th>Passport Issued At</th><td>${row.passportIssuedAt || ""}</td></tr>
            <tr><th>Passport Valid Until</th><td>${row.passportValidUntil ? new Date(row.passportValidUntil).toLocaleDateString() : ""}</td></tr>
            <tr><th>Residence Kenya</th><td>${row.residenceKenya || ""}</td></tr>
            <tr><th>Residence Mozambique</th><td>${row.residenceMozambique || ""}</td></tr>
            <tr><th>District</th><td>${row.district || ""}</td></tr>
            <tr><th>Documents Presented</th><td>${row.documentsPresented || ""}</td></tr>
            <tr><th>Issued On</th><td>${row.issuedOn ? new Date(row.issuedOn).toLocaleDateString() : ""}</td></tr>
            <tr><th>Entry Date Kenya</th><td>${row.entryDateKenya ? new Date(row.entryDateKenya).toLocaleDateString() : ""}</td></tr>
            <tr><th>Current Residence</th><td>${row.currentResidence || ""}</td></tr>
            <tr><th>Observations</th><td>${row.observations || ""}</td></tr>
          </table>
          ${spouse}
          ${familyMoz}
          ${familyU15}
          ${
            row.formImages && row.formImages.length
              ? `<h4>Attached Images</h4>${row.formImages
                  .map(
                    (img) =>
                      `<img src="${img}" alt="Form image" style="max-width:300px; margin-bottom:8px; display:block;"/>`
                  )
                  .join("")}`
              : ""
          }
          <br><br>
          <button onclick="window.print();">Print</button>
        </body>
      </html>
    `;
    // Open new window and print
    const printWindow = window.open('', '', 'height=800,width=600');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
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
      maxWidth="sm"
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
            <Typography variant="h6" align="center" gutterBottom>
              Consular Registration Form
            </Typography>
            {printReg.passportPhoto && (
              <Avatar
                src={printReg.passportPhoto}
                alt="Passport"
                sx={{ width: 120, height: 120, margin: "0 auto 16px auto" }}
                variant="rounded"
              />
            )}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px" }}>
              <tbody>
                <tr>
                  <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>
                    Full Name
                  </th>
                  <td style={{ border: "1px solid #222", padding: "8px" }}>
                    {printReg.fullName}
                  </td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>
                    Form Number
                  </th>
                  <td style={{ border: "1px solid #222", padding: "8px" }}>
                    {printReg.fileNumber}
                  </td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Country/Place of Birth</th>
                  <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.countryPlaceOfBirth}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Birth Date</th>
                  <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.birthDate ? new Date(printReg.birthDate).toLocaleDateString() : ""}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Marital Status</th>
                  <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.maritalStatus}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Profession</th>
                  <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.profession}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Education</th>
                  <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.education}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Workplace/School</th>
                  <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.workplaceOrSchool}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Phone</th>
                  <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.phone}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Cell Phone</th>
                  <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.cellPhone}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Father's Name</th>
                  <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.fatherName}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Mother's Name</th>
                  <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.motherName}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Passport/ID Number</th>
                  <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.passportOrIdNumber}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Passport Issued At</th>
                  <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.passportIssuedAt}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Passport Valid Until</th>
                  <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.passportValidUntil ? new Date(printReg.passportValidUntil).toLocaleDateString() : ""}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Residence (Kenya)</th>
                  <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.residenceKenya}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Residence (Mozambique)</th>
                  <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.residenceMozambique}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>District</th>
                  <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.district}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Documents Presented</th>
                  <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.documentsPresented}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Issued On</th>
                  <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.issuedOn ? new Date(printReg.issuedOn).toLocaleDateString() : ""}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Entry Date Kenya</th>
                  <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.entryDateKenya ? new Date(printReg.entryDateKenya).toLocaleDateString() : ""}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Current Residence</th>
                  <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.currentResidence}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Observations</th>
                  <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.observations}</td>
                </tr>
              </tbody>
            </table>
            {/* Spouse */}
            {printReg.spouse && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>Spouse Details</Typography>
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px" }}>
                  <tbody>
                    <tr>
                      <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Full Name</th>
                      <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.spouse.fullName}</td>
                    </tr>
                    <tr>
                      <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Nationality</th>
                      <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.spouse.nationality}</td>
                    </tr>
                    <tr>
                      <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>ID Document</th>
                      <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.spouse.idDocument}</td>
                    </tr>
                    <tr>
                      <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Profession</th>
                      <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.spouse.profession}</td>
                    </tr>
                    <tr>
                      <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Workplace</th>
                      <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.spouse.workplace}</td>
                    </tr>
                    <tr>
                      <th style={{ textAlign: "left", border: "1px solid #222", padding: "8px" }}>Cell Phone</th>
                      <td style={{ border: "1px solid #222", padding: "8px" }}>{printReg.spouse.cellPhone}</td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
            {/* Family Mozambique */}
            {printReg.familyMozambique && printReg.familyMozambique.length > 0 && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>Family in Mozambique</Typography>
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px" }}>
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid #222", padding: "8px" }}>Name</th>
                      <th style={{ border: "1px solid #222", padding: "8px" }}>Relationship</th>
                      <th style={{ border: "1px solid #222", padding: "8px" }}>Age</th>
                      <th style={{ border: "1px solid #222", padding: "8px" }}>Residence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printReg.familyMozambique.map((fm, idx) => (
                      <tr key={idx}>
                        <td style={{ border: "1px solid #222", padding: "8px" }}>{fm.name}</td>
                        <td style={{ border: "1px solid #222", padding: "8px" }}>{fm.relationship}</td>
                        <td style={{ border: "1px solid #222", padding: "8px" }}>{fm.age}</td>
                        <td style={{ border: "1px solid #222", padding: "8px" }}>{fm.residence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            {/* Family Under 15 */}
            {printReg.familyUnder15 && printReg.familyUnder15.length > 0 && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>Family Under 15</Typography>
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px" }}>
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid #222", padding: "8px" }}>Name</th>
                      <th style={{ border: "1px solid #222", padding: "8px" }}>Relationship</th>
                      <th style={{ border: "1px solid #222", padding: "8px" }}>Age</th>
                      <th style={{ border: "1px solid #222", padding: "8px" }}>Residence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printReg.familyUnder15.map((fm, idx) => (
                      <tr key={idx}>
                        <td style={{ border: "1px solid #222", padding: "8px" }}>{fm.name}</td>
                        <td style={{ border: "1px solid #222", padding: "8px" }}>{fm.relationship}</td>
                        <td style={{ border: "1px solid #222", padding: "8px" }}>
                          {fm.ageType === "months" && fm.age ? `${fm.age} months` :
                           fm.ageType === "years" && fm.age ? `${fm.age} years` :
                           fm.age || ""}
                        </td>
                        <td style={{ border: "1px solid #222", padding: "8px" }}>{fm.residence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            {/* Images */}
            {printReg.formImages && printReg.formImages.length > 0 && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>Attached Images</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {printReg.formImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Form image ${idx + 1}`}
                      style={{ maxWidth: "300px", marginBottom: "8px", display: "block" }}
                    />
                  ))}
                </Box>
              </>
            )}
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <button
                onClick={() => {
                  // Print only the dialog content
                  const printContents = printRef.current.innerHTML;
                  const printWindow = window.open('', '', 'height=800,width=600');
                  printWindow.document.write(`
                    <html>
                      <head>
                        <title>Print Registration</title>
                        <style>
                          body { font-family: Arial, sans-serif; padding: 32px; }
                          table { border-collapse: collapse; width: 100%; }
                          td, th { border: 1px solid #222; padding: 8px; }
                          th { text-align: left; }
                          img { max-width: 300px; margin-bottom: 8px; display: block; }
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