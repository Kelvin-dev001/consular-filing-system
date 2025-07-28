import React, { useRef } from "react";
import RegistrationFormPrintable from "./RegistrationFormPrintable";
import { Button, Box, Typography } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";

export default function ConfirmationPage({ form }) {
  const printRef = useRef();

  const handlePrint = () => {
    // Print only the contents of the printable form
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=900,width=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Inscrição Consular</title>
          <link rel="stylesheet" href="/RegistrationFormPrintable.module.css" />
          <style>
            body { font-family: Arial, serif; background: #f9b6d1; }
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

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, mb: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Confirmação de Inscrição Consular
      </Typography>
      <Typography align="center" color="text.secondary" sx={{ mb: 3 }}>
        Revise os dados abaixo. Se estiver tudo correto, clique em <b>Imprimir</b> para obter sua ficha.<br />
        Caso precise corrigir, utilize o botão "Voltar" do navegador ou o menu do sistema.
      </Typography>
      <div ref={printRef}>
        <RegistrationFormPrintable form={form} />
      </div>
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrint}
          sx={{ mr: 2, px: 4 }}
          startIcon={<PrintIcon />}
        >
          Imprimir
        </Button>
      </Box>
    </Box>
  );
}