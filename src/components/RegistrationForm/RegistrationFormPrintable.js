import React, { forwardRef } from "react";

const RegistrationFormPrintable = forwardRef(({ formData }, ref) => (
  <div ref={ref} style={{ width: "21cm", minHeight: "29.7cm", padding: "2cm", background: "#f8b8d0" }}>
    {/* Layout the form as per image 2 (front) and image 1 (back) */}
    {/* Use tables, divs, and inline styles to mimic the physical form */}
    {/* Example below is highly simplified; you must style it to match the real form */}
    <h3 style={{ textAlign: "center" }}>REPÚBLICA DE MOÇAMBIQUE<br/>CONSULADO DA REPÚBLICA DE MOÇAMBIQUE EM MOMBASA</h3>
    <h4 style={{ textAlign: "center" }}>INSCRIÇÃO CONSULAR</h4>
    {/* ... all fields here, using formData values ... */}
    <hr/>
    {/* Add all sections, tables, and fields per images */}
  </div>
));
export default RegistrationFormPrintable;