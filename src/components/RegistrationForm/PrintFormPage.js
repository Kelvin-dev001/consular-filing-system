import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { FaPrint } from 'react-icons/fa';
import RegistrationFormPrintable from "./RegistrationFormPrintable";

function PrintFormPage({ form }) {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Inscrição Consular",
  });

  return (
    <div>
      <button onClick={handlePrint} style={{ marginBottom: 16, fontSize: 20, padding: 10 }}>
        <FaPrint style={{ marginRight: 10, fontSize: 24, color: "black", verticalAlign: "middle" }} />
        Print
      </button>
      <div>
        <RegistrationFormPrintable ref={componentRef} form={form} />
      </div>
    </div>
  );
}

export default PrintFormPage;