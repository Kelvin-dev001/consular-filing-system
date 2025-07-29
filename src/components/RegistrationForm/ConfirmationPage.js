import React, { useRef } from "react";
import RegistrationFormPrintable from "./RegistrationFormPrintable";
import { Button, Box, Typography } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function ConfirmationPage({ form, onBack }) {
  const printRef = useRef();
  const navigate = useNavigate();

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=900,width=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Inscrição Consular</title>
          <style>
            body { font-family: Arial, serif; background: #fff; color:#111; padding:0; margin:0; }
            .printableForm {
              background: #fff;
              padding: 32px;
              font-family: Arial, serif;
              color: #111;
              max-width: 900px;
              margin: 0 auto;
              box-sizing: border-box;
            }
            .logoRow {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-bottom: 4px;
            }
            .logoImg {
              width: 100px;
              height: 100px;
              object-fit: contain;
              display: block;
              margin: 0 auto;
            }
            .headerRowFlex {
              display: flex;
              flex-direction: row;
              align-items: flex-start;
              justify-content: center;
              gap: 48px;
              margin-bottom: 12px;
            }
            .titlesBlock {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              justify-content: center;
              flex: 1 1 auto;
              min-width: 340px;
            }
            .headerLine {
              font-weight: bold;
              font-size: 1.16em;
              text-transform: uppercase;
              letter-spacing: 0.6px;
              text-align: left;
              line-height: 1.15;
              margin: 0;
            }
            .sectionTitlePrint {
              font-weight: bold;
              margin: 16px 0 6px 0;
              text-transform: uppercase;
              font-size: 1.12em;
              letter-spacing: 0.5px;
              text-align: left;
            }
            .photoBox {
              width: 100px;
              height: 100px;
              border: 2px solid #222;
              margin-top: 8px;
              background: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              position: relative;
            }
            .photoPreview {
              max-width: 96px;
              max-height: 96px;
              width: auto;
              height: auto;
              object-fit: cover;
              border-radius: 4px;
              display: block;
              background: #fff;
            }
            .metaSection {
              text-align: left;
              margin-top: 12px;
              margin-bottom: 10px;
            }
            .sectionTitle {
              text-align: center;
              font-weight: bold;
              margin: 28px 0 12px 0;
              text-transform: uppercase;
              font-size: 1.12em;
              letter-spacing: 0.5px;
            }
            .table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 18px;
            }
            .table th,
            .table td {
              border: 1.5px solid #222;
              padding: 8px;
              min-height: 32px;
              font-size: 1em;
              text-align: left;
              background: #fff;
            }
            .table th {
              background: #f3a2c2;
              font-weight: bold;
              text-align: center;
            }
            .dottedLine {
              border-bottom: 1px dotted #222;
              width: 100%;
              display: inline-block;
              margin: 10px 0;
            }
            .footerRow {
              display: flex;
              justify-content: space-between;
              margin-top: 32px;
              font-size: 1em;
            }
            .imagesRow {
              display: flex;
              gap: 18px;
              flex-wrap: wrap;
              margin-bottom: 16px;
            }
            .uploadedImg {
              max-width: 160px;
              max-height: 140px;
              border: 1.5px solid #b10056;
              border-radius: 4px;
              margin-right: 8px;
              background: #fff;
            }
            .no-print { display: block; }
            @media print {
              .printableForm {
                background: #fff !important;
                box-shadow: none !important;
                padding: 6px !important;
                margin: 0 !important;
                color: #111 !important;
                max-width: 100% !important;
              }
              .header, .sectionTitle, .footerRow {
                color: #111 !important;
                background: none !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .table th, .table td {
                background: #fff !important;
                color: #111 !important;
                border: 1px solid #222 !important;
                border-width: 1px !important;
                padding: 6px !important;
                font-size: 0.95em !important;
              }
              .table th {
                font-weight: bold !important;
                text-align: center !important;
              }
              .photoBox {
                border: 1px solid #222 !important;
                background: #fff !important;
                width: 95px !important;
                height: 95px !important;
                overflow: hidden !important;
              }
              .photoPreview {
                max-width: 88px !important;
                max-height: 88px !important;
                object-fit: cover !important;
              }
              img {
                max-width: 100px !important;
                max-height: 100px !important;
                margin-bottom: 8px !important;
                outline: none !important;
                background: #fff !important;
              }
              button, .no-print {
                display: none !important;
              }
            }
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
          onClick={onBack}
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