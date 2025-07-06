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
      <button onClick={handlePrint} style={{ marginBottom: 16 }}>
        <FaPrint style={{ marginRight: 8 }} />
        Print
      </button>
      <div>
        <RegistrationFormPrintable ref={componentRef} form={form} />
      </div>
    </div>
  );
}

export default PrintFormPage;