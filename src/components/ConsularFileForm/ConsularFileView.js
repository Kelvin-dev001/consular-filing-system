import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Box,
  Divider,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import API from "../../utils/api";

export default function ConsularFileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  useEffect(() => {
    setLoading(true);
    API.get(`/consular-files/${id}`)
      .then((res) => setFile(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => {
    // Print just the details section
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const win = window.open("", "PrintWindow", "width=900,height=700");
      win.document.write(`
        <html>
          <head>
            <title>Consular File</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              h2 { margin-bottom: 16px; }
              table { border-collapse: collapse; width: 100%; }
              td, th { border: 1px solid #ccc; padding: 8px; }
              .section-title { margin-top: 32px; }
            </style>
          </head>
          <body>
            ${printContents}
          </body>
        </html>
      `);
      win.document.close();
      setTimeout(() => win.print(), 300);
    }
  };

  if (loading) {
    return (
      <Box sx={{ pt: 10, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!file) {
    return (
      <Box sx={{ pt: 10, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Consular file not found.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
          onClick={() => navigate("/consular-files")}
        >
          Back to Table
        </Button>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 850, mx: "auto", mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/consular-files")}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="info"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
        >
          Print
        </Button>
      </Box>

      <div ref={printRef}>
        <Typography variant="h4" gutterBottom>Consular File Details</Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>File Number:</strong> {file.fileNumber}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>Opened On:</strong> {file.openedOn ? new Date(file.openedOn).toLocaleDateString() : ""}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>Name:</strong> {file.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>Spouse:</strong> {file.spouse}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>Spouse Nationality:</strong> {file.spouseNationality}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>Spouse Profession:</strong> {file.spouseProfession}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>Spouse Workplace:</strong> {file.spouseWorkplace}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>Spouse ID Document:</strong> {file.spouseIdDocument}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1"><strong>Spouse Cell Phone:</strong> {file.spouseCellPhone}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" className="section-title">Passports Granted</Typography>
        <table>
          <thead>
            <tr>
              <th>Number</th>
              <th>Issue Date</th>
              <th>Expiry Date</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(file.passportsGranted) && file.passportsGranted.length > 0 ? (
              file.passportsGranted.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.number}</td>
                  <td>{p.issueDate ? new Date(p.issueDate).toLocaleDateString() : ""}</td>
                  <td>{p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : ""}</td>
                  <td>{p.country}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No passports granted.</td>
              </tr>
            )}
          </tbody>
        </table>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" className="section-title">Repatriations</Typography>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Conditions</th>
              <th>State Charges</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(file.repatriations) && file.repatriations.length > 0 ? (
              file.repatriations.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.date ? new Date(r.date).toLocaleDateString() : ""}</td>
                  <td>{r.conditions}</td>
                  <td>{r.stateCharges}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>No repatriations.</td>
              </tr>
            )}
          </tbody>
        </table>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" className="section-title">Civil & Notary Acts</Typography>
        <Typography>{file.civilNotarialActs}</Typography>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" className="section-title">Applicant Signature</Typography>
        <Typography>{file.applicantSignature}</Typography>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" className="section-title">Observations</Typography>
        <Typography>{file.observations}</Typography>

        {file.attachment && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" className="section-title">Attachment</Typography>
            <a href={file.attachment} target="_blank" rel="noopener noreferrer">
              {file.attachment}
            </a>
          </>
        )}
      </div>
    </Paper>
  );
}