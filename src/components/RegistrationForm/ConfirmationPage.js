import React, { useRef } from "react";
import { Button, Typography, Box, Paper } from "@mui/material";
import ReactToPrint from "react-to-print";
import RegistrationFormPrintable from "./RegistrationFormPrintable";

export default function ConfirmationPage({ form }) {
  const printRef = useRef();

  return (
    <Paper sx={{ maxWidth: 850, margin: "auto", p: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Registration Submitted!
      </Typography>
      <Typography sx={{ mb: 3 }}>
        Thank you. You may now print or save a PDF of your registration form.
      </Typography>
      <ReactToPrint
        trigger={() => (
          <Button variant="contained" sx={{ mb: 2 }}>
            Print / Export PDF
          </Button>
        )}
        content={() => printRef.current}
        documentTitle="Inscricao Consular"
      />
      {/* Hidden printable component */}
      <div style={{ display: "none" }}>
        <RegistrationFormPrintable ref={printRef} form={form} />
      </div>
      {/* Optionally, show a summary or confirmation details here */}
    </Paper>
  );
}