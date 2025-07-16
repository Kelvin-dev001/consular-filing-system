import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { FaPrint } from 'react-icons/fa';
import RegistrationFormPrintable from "./RegistrationFormPrintable";

function PrintFormPage({ form }) {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Inscrição Consular",
    // Optional: Remove print preview toolbar, can be customized as needed
    // removeAfterPrint: true,
  });

  return (
    <div>
      <button
        onClick={handlePrint}
        style={{
          marginBottom: 16,
          fontSize: 20,
          padding: 10,
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "#f3a2c2",
          border: "2px solid #b10056",
          borderRadius: 6,
          color: "#222",
          cursor: "pointer"
        }}
      >
        <FaPrint
          style={{
            fontSize: 24,
            color: "#b10056",
            verticalAlign: "middle"
          }}
        />
        Imprimir
      </button>
      <div>
        {/* RegistrationFormPrintable will render the emblem, photo, and all fields as per your updated design */}
        <RegistrationFormPrintable ref={componentRef} form={form} />
      </div>
    </div>
  );
}

export default PrintFormPage;