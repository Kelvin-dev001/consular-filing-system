import React, { useRef } from "react";
import { Button } from "@mui/material";
import ReactToPrint from "react-to-print";
import RegistrationFormPrintable from "./RegistrationFormPrintable";

export default function ConfirmationPage({ formData }) {
  const printRef = useRef();

  return (
    <div>
      {/* Other content */}
      <ReactToPrint
        trigger={() => <Button variant="contained">Print/Export PDF</Button>}
        content={() => printRef.current}
        documentTitle="Inscricao Consular"
      />
      {/* Hidden printable component */}
      <div style={{ display: "none" }}>
        <RegistrationFormPrintable ref={printRef} formData={formData} />
      </div>
    </div>
  );
}