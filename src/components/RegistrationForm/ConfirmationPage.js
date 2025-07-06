import React, { useRef } from "react";
import RegistrationFormPrintable from "./RegistrationFormPrintable";

export default function ConfirmationPage({ form }) {
  const printRef = useRef();
  console.log("RegistrationFormPrintable is:", RegistrationFormPrintable);
  return (
    <div>
      <RegistrationFormPrintable ref={printRef} form={form} />
    </div>
  );
}