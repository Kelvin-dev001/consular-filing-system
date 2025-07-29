import React, { useRef } from "react";
import RegistrationFormPrintable from "./RegistrationFormPrintable";
import { Button, Box, Typography } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function ConfirmationPage({ form }) {
  const printRef = useRef();
  const navigate = useNavigate();

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=900,width=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Inscrição Consular</title>
          <link rel="stylesheet" href="/RegistrationFormPrintable.module.css" />
          <style>
            body { font-family: Arial, serif; background: #fff; }
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
  };

  const handleBack = () => {
    // Go back to the registration wizard for editing
    navigate("/registration-form", { state: { form } });
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, mb: 4 }}>
      {/* Instructions and buttons are wrapped in .no-print so they won't appear on the printed form */}
      <div className="no-print">
        <Typography variant="h4" align="center" gutterBottom>
          Confirmação de Inscrição Consular
        </Typography>
        <Typography align="center" color="text.secondary" sx={{ mb: 3 }}>
          Revise os dados abaixo. Se estiver tudo correto, clique em <b>Imprimir</b> para obter sua ficha.<br />
          Caso precise corrigir, utilize o botão <b>Voltar</b> para editar.
        </Typography>
      </div>
      <div ref={printRef}>
        <RegistrationFormPrintable form={form} />
      </div>
      <Box className="no-print" sx={{ textAlign: "center", mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleBack}
          sx={{ px: 4 }}
          startIcon={<ArrowBackIcon />}
        >
          Voltar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrint}
          sx={{ px: 4 }}
          startIcon={<PrintIcon />}
        >
          Imprimir
        </Button>
      </Box>
    </Box>
  );
}