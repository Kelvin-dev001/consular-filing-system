import React from "react";

// If you use CSS modules, import as below (but remember, print preview may not have access!)
// import styles from "./RegistrationFormPrintable.module.css";

// We'll use inline styles for the photo section to guarantee print correctness

export default function RegistrationFormPrintable({ form }) {
  // Helper to show value or a dash
  const show = (val) => val ? val : "—";

  return (
    <div className="printableForm" style={{
      background: "#fff",
      padding: 32,
      fontFamily: "Arial, serif",
      color: "#111",
      maxWidth: 900,
      margin: "0 auto",
      boxSizing: "border-box"
    }}>
      {/* Logo Row */}
      <div className="logoRow" style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 4
      }}>
        <img
          src="/logo-emblem.png"
          alt="Emblem"
          className="logoImg"
          style={{
            width: 100,
            height: 100,
            objectFit: "contain",
            display: "block",
            margin: "0 auto"
          }}
        />
      </div>

      {/* Header Row: Titles and Photo */}
      <div className="headerRowFlex" style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 48,
        marginBottom: 12
      }}>
        <div className="titlesBlock" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "center",
          flex: "1 1 auto",
          minWidth: 340
        }}>
          <h2 className="headerLine" style={{
            fontWeight: "bold",
            fontSize: "1.16em",
            textTransform: "uppercase",
            letterSpacing: "0.6px",
            textAlign: "left",
            lineHeight: 1.15,
            margin: 0
          }}>
            República de Moçambique
          </h2>
          <h3 className="headerLine" style={{
            fontWeight: "bold",
            fontSize: "1.16em",
            textTransform: "uppercase",
            letterSpacing: "0.6px",
            textAlign: "left",
            lineHeight: 1.15,
            margin: 0
          }}>
            Embaixada em Nairobi
          </h3>
          <h4 className="headerLine" style={{
            fontWeight: "bold",
            fontSize: "1.16em",
            textTransform: "uppercase",
            letterSpacing: "0.6px",
            textAlign: "left",
            lineHeight: 1.15,
            margin: 0
          }}>
            Ficha de Inscrição Consular
          </h4>
        </div>
        {/* Passport Photo Box with inline styles for print safety */}
        <div
          className="photoBox"
          style={{
            width: 100,
            height: 100,
            border: "2px solid #222",
            marginTop: 8,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative"
          }}>
          {form?.passportPhoto ? (
            <img
              src={
                typeof form.passportPhoto === "string"
                  ? form.passportPhoto
                  : URL.createObjectURL(form.passportPhoto)
              }
              alt="Foto do Passaporte"
              className="photoPreview"
              crossOrigin="anonymous"
              style={{
                maxWidth: 96,
                maxHeight: 96,
                width: "auto",
                height: "auto",
                objectFit: "cover",
                borderRadius: 4,
                display: "block",
                background: "#fff"
              }}
            />
          ) : null}
        </div>
      </div>

      {/* Consular Registration Section */}
      <div className="metaSection" style={{
        textAlign: "left",
        marginTop: 12,
        marginBottom: 10
      }}>
        <div>
          <b>Nº de Inscrição Consular:</b> {show(form.fileNumber)}
        </div>
        <div>
          <b>Emitido em:</b> {show(form.issuedOn)} &nbsp; <b>Validade:</b> {show(form.validity)}
        </div>
      </div>

      {/* Personal Information Table */}
      <div className="sectionTitlePrint" style={{
        fontWeight: "bold",
        margin: "16px 0 6px 0",
        textTransform: "uppercase",
        fontSize: "1.12em",
        letterSpacing: "0.5px",
        textAlign: "left"
      }}>
        Dados Pessoais
      </div>
      <table className="table" style={{ width: "100%", borderCollapse: "collapse", marginBottom: 18 }}>
        <tbody>
          <tr>
            <th>Nome Completo</th>
            <td>{show(form.fullName)}</td>
            <th>Data de Nascimento</th>
            <td>{show(form.birthDate)}</td>
          </tr>
          <tr>
            <th>Naturalidade</th>
            <td>{show(form.countryPlaceOfBirth)}</td>
            <th>Estado Civil</th>
            <td>{show(form.maritalStatus)}</td>
          </tr>
          <tr>
            <th>Nome do Pai</th>
            <td>{show(form.fatherName)}</td>
            <th>Nome da Mãe</th>
            <td>{show(form.motherName)}</td>
          </tr>
          <tr>
            <th>Escolaridade</th>
            <td>{show(form.education)}</td>
            <th>Profissão</th>
            <td>{show(form.profession)}</td>
          </tr>
          <tr>
            <th>Local de Trabalho/Escola</th>
            <td>{show(form.workplaceOrSchool)}</td>
            <th>Telefone</th>
            <td>{show(form.phone)}</td>
          </tr>
          <tr>
            <th>Telemóvel</th>
            <td>{show(form.cellPhone)}</td>
            <th>Tipo de Documento</th>
            <td>{show(form.passportOrIdType)}</td>
          </tr>
          <tr>
            <th>Nº do Documento</th>
            <td>{show(form.passportOrIdNumber)}</td>
            <th>Emissão</th>
            <td>{show(form.passportIssuedAt)}</td>
          </tr>
          <tr>
            <th>Válido Até</th>
            <td>{show(form.passportValidUntil)}</td>
            <th>Residência Quénia</th>
            <td>{show(form.residenceKenya)}</td>
          </tr>
          <tr>
            <th>Localidade</th>
            <td>{show(form.location)}</td>
            <th>Residência Moçambique</th>
            <td>{show(form.residenceMozambique)}</td>
          </tr>
          <tr>
            <th>Distrito</th>
            <td>{show(form.district)}</td>
            <th>Documentos Apresentados</th>
            <td>{show(form.documentsPresented)}</td>
          </tr>
          <tr>
            <th>Residência Atual</th>
            <td colSpan={3}>{show(form.currentResidence)}</td>
          </tr>
        </tbody>
      </table>

      {/* Spouse Information */}
      <div className="sectionTitlePrint" style={{
        fontWeight: "bold",
        margin: "16px 0 6px 0",
        textTransform: "uppercase",
        fontSize: "1.12em",
        letterSpacing: "0.5px",
        textAlign: "left"
      }}>
        Dados do Cônjuge
      </div>
      <table className="table" style={{ width: "100%", borderCollapse: "collapse", marginBottom: 18 }}>
        <tbody>
          <tr>
            <th>Nome Completo</th>
            <td>{show(form.spouse.fullName)}</td>
            <th>Nacionalidade</th>
            <td>{show(form.spouse.nationality)}</td>
          </tr>
          <tr>
            <th>Documento de Identificação</th>
            <td>{show(form.spouse.idDocument)}</td>
            <th>Profissão</th>
            <td>{show(form.spouse.profession)}</td>
          </tr>
          <tr>
            <th>Local de Trabalho</th>
            <td>{show(form.spouse.workplace)}</td>
            <th>Telemóvel</th>
            <td>{show(form.spouse.cellPhone)}</td>
          </tr>
        </tbody>
      </table>

      {/* Family in Mozambique */}
      <div className="sectionTitlePrint" style={{ fontWeight: "bold", margin: "16px 0 6px 0", textTransform: "uppercase", fontSize: "1.12em", letterSpacing: "0.5px", textAlign: "left" }}>
        Família em Moçambique
      </div>
      <table className="table" style={{ width: "100%", borderCollapse: "collapse", marginBottom: 18 }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Parentesco</th>
            <th>Residência</th>
          </tr>
        </thead>
        <tbody>
          {form.familyMozambique && form.familyMozambique.length > 0 ? form.familyMozambique.map((f, i) => (
            <tr key={i}>
              <td>{show(f.name)}</td>
              <td>{show(f.relationship)}</td>
              <td>{show(f.residence)}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan={3}>—</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Family Under 15 (Kenya) */}
      <div className="sectionTitlePrint" style={{ fontWeight: "bold", margin: "16px 0 6px 0", textTransform: "uppercase", fontSize: "1.12em", letterSpacing: "0.5px", textAlign: "left" }}>
        Família Menor de 15 anos no Quénia
      </div>
      <table className="table" style={{ width: "100%", borderCollapse: "collapse", marginBottom: 18 }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Parentesco</th>
            <th>Idade</th>
            <th>Tipo de Idade</th>
          </tr>
        </thead>
        <tbody>
          {form.familyUnder15 && form.familyUnder15.length > 0 ? form.familyUnder15.map((f, i) => (
            <tr key={i}>
              <td>{show(f.name)}</td>
              <td>{show(f.relationship)}</td>
              <td>{show(f.age)}</td>
              <td>{show(f.ageType)}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan={4}>—</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Consular Card */}
      <div className="sectionTitlePrint" style={{ fontWeight: "bold", margin: "16px 0 6px 0", textTransform: "uppercase", fontSize: "1.12em", letterSpacing: "0.5px", textAlign: "left" }}>
        Cartão Consular
      </div>
      <table className="table" style={{ width: "100%", borderCollapse: "collapse", marginBottom: 18 }}>
        <tbody>
          <tr>
            <th>Número do Cartão</th>
            <td>{show(form.consularCardNumber)}</td>
            <th>Data de Emissão</th>
            <td>{show(form.consularCardIssueDate)}</td>
          </tr>
        </tbody>
      </table>

      {/* Passports / IDs */}
      <div className="sectionTitlePrint" style={{ fontWeight: "bold", margin: "16px 0 6px 0", textTransform: "uppercase", fontSize: "1.12em", letterSpacing: "0.5px", textAlign: "left" }}>
        Passaportes / Documentos de Identidade
      </div>
      <table className="table" style={{ width: "100%", borderCollapse: "collapse", marginBottom: 18 }}>
        <thead>
          <tr>
            <th>Número</th>
            <th>Data de Emissão</th>
            <th>Validade</th>
            <th>País</th>
          </tr>
        </thead>
        <tbody>
          {form.passports && form.passports.length > 0 ? form.passports.map((p, i) => (
            <tr key={i}>
              <td>{show(p.number)}</td>
              <td>{show(p.issueDate)}</td>
              <td>{show(p.expiryDate)}</td>
              <td>{show(p.country)}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan={4}>—</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Repatriations */}
      <div className="sectionTitlePrint" style={{ fontWeight: "bold", margin: "16px 0 6px 0", textTransform: "uppercase", fontSize: "1.12em", letterSpacing: "0.5px", textAlign: "left" }}>
        Repatriamentos
      </div>
      <table className="table" style={{ width: "100%", borderCollapse: "collapse", marginBottom: 18 }}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Condições</th>
            <th>Encargos</th>
          </tr>
        </thead>
        <tbody>
          {form.repatriations && form.repatriations.length > 0 ? form.repatriations.map((r, i) => (
            <tr key={i}>
              <td>{show(r.date)}</td>
              <td>{show(r.conditions)}</td>
              <td>{show(r.charges)}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan={3}>—</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Civil/Notary Acts */}
      <div className="sectionTitlePrint" style={{ fontWeight: "bold", margin: "16px 0 6px 0", textTransform: "uppercase", fontSize: "1.12em", letterSpacing: "0.5px", textAlign: "left" }}>
        Atos Civis / Notariais
      </div>
      <div style={{
        border: "1.5px solid #222",
        padding: 8,
        minHeight: 32,
        fontSize: "1em",
        textAlign: "left",
        background: "#fff",
        marginBottom: 18
      }}>
        {show(form.civilActs)}
      </div>

      {/* Observations & Attachments */}
      <div className="sectionTitlePrint" style={{ fontWeight: "bold", margin: "16px 0 6px 0", textTransform: "uppercase", fontSize: "1.12em", letterSpacing: "0.5px", textAlign: "left" }}>
        Observações & Anexos
      </div>
      <div style={{
        border: "1.5px solid #222",
        padding: 8,
        minHeight: 32,
        fontSize: "1em",
        textAlign: "left",
        background: "#fff",
        marginBottom: 18
      }}>
        {show(form.observations)}
      </div>

      {/* Images Row (if you have formImages logic) */}
      {form.formImages && form.formImages.length > 0 && (
        <div className="imagesRow" style={{
          display: "flex",
          gap: 18,
          flexWrap: "wrap",
          marginBottom: 16
        }}>
          {form.formImages.map((img, idx) => (
            <img
              key={idx}
              src={typeof img === "string" ? img : URL.createObjectURL(img)}
              alt={`Attachment ${idx + 1}`}
              className="uploadedImg"
              style={{
                maxWidth: 160,
                maxHeight: 140,
                border: "1.5px solid #b10056",
                borderRadius: 4,
                marginRight: 8,
                background: "#fff"
              }}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="footerRow" style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: 32,
        fontSize: "1em"
      }}>
        <span>Data: {new Date().toLocaleDateString()}</span>
        <span>Assinatura: __________________________</span>
      </div>
    </div>
  );
}