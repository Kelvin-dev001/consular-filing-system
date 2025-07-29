import React from "react";

// Helper for dotted lines
const Dots = ({ length = 30 }) => (
  <span style={{ letterSpacing: "2px", fontFamily: "monospace" }}>
    {".".repeat(length)}
  </span>
);

export default function RegistrationFormPrintable({ form }) {
  // Helper for field display (blank if missing)
  const show = (val, len = 20) =>
    val && val !== "" ? <span>{val}</span> : <Dots length={len} />;

  // Passport photo logic
  let passPhoto = null;
  if (form?.passportPhoto) {
    passPhoto = (
      <img
        src={
          typeof form.passportPhoto === "string"
            ? form.passportPhoto
            : URL.createObjectURL(form.passportPhoto)
        }
        alt="Passaporte"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 2,
          display: "block",
          background: "#fff"
        }}
      />
    );
  }

  // Styles
  const tableStyle = { width: "100%", borderCollapse: "collapse", marginBottom: 12 };
  const tdStyle = { border: "1.5px solid #222", padding: "3px 6px", fontSize: "1em" };

  // Helper for family arrays with at least n rows
  const fillRows = (arr, n, cols) =>
    [...Array(Math.max(n, arr?.length || 0))].map((_, i) => arr?.[i] || Object.fromEntries(cols.map(c => [c, ""])));

  return (
    <div style={{
      background: "#fff",
      padding: 0,
      fontFamily: "Times New Roman, Times, serif",
      color: "#000",
      maxWidth: 750,
      minHeight: 1100,
      margin: "0 auto",
      boxSizing: "border-box"
    }}>
      {/* HEADER */}
      <div style={{ textAlign: "center", marginTop: 25, marginBottom: 6 }}>
        <img
          src="/emblem-mozambique.jpeg"
          alt="Emblema"
          style={{
            width: 80,
            height: 80,
            objectFit: "contain",
            margin: "0 auto",
            display: "block"
          }}
        />
      </div>
      <div style={{
        fontWeight: "bold",
        textAlign: "center",
        fontSize: "1.25em",
        letterSpacing: 1,
        lineHeight: 1.25,
        fontFamily: "Times New Roman, Times, serif",
        marginBottom: 5
      }}>
        REPÚBLICA DE MOÇAMBIQUE <br />
        CONSULADO DA REPÚBLICA DE <br />
        MOÇAMBIQUE EM MOMBASA
      </div>
      {/* Row: Title and photo box */}
      <div style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginTop: 22,
        marginBottom: 10,
        paddingLeft: 24,
        paddingRight: 32
      }}>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{
            fontWeight: "bold",
            fontSize: "1.18em",
            marginBottom: 6,
            marginTop: 2,
            textTransform: "uppercase",
            fontFamily: "Times New Roman, Times, serif"
          }}>
            INSCRIÇÃO CONSULAR
          </div>
        </div>
        <div style={{
          width: 136,
          height: 136,
          border: "2px solid #000",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative"
        }}>
          {passPhoto}
        </div>
      </div>
      {/* Consular info */}
      <div style={{
        margin: "0 0 10px 0",
        fontSize: "1.01em",
        paddingLeft: 24
      }}>
        <div>
          <b>INSC. CONSULAR Nº</b> {show(form.fileNumber, 30)}
        </div>
        <div>
          <b>DATA DE EMISSÃO</b> {show(form.issuedOn, 18)} <b>VALIDADE</b> {show(form.validity, 18)}
        </div>
      </div>

      {/* Personal Information */}
      <div style={{
        border: "1.5px solid #222",
        marginBottom: 10,
        padding: "2px 10px 2px 10px"
      }}>
        <div>
          Nome completo {show(form.fullName, 70)}
        </div>
        <div>
          País e local de nascimento {show(form.countryPlaceOfBirth, 56)}
        </div>
        <div>
          Data de Nascimento {show(form.birthDate, 12)} &nbsp; Estado Civil {show(form.maritalStatus, 20)}
        </div>
        <div>
          Nome do Pai {show(form.fatherName, 56)}
        </div>
        <div>
          Nome da Mãe {show(form.motherName, 56)}
        </div>
        <div>
          Habilitações Literárias {show(form.education, 14)} profissão {show(form.profession, 20)} Local de trabalho {show(form.workplaceOrSchool, 22)}
        </div>
        <div>
          Telefone {show(form.phone, 16)} (Estudante, local de ensino) {show(form.workplaceOrSchool, 32)}
        </div>
        <div>
          Portador de passaporte/C. Emergencia/BI/Cédula pessoal Nº {show(form.passportOrIdNumber, 30)} Emitido em {show(form.passportIssuedAt, 16)}
        </div>
        <div>
          Válido até {show(form.passportValidUntil, 16)} Última residência em Moçambique {show(form.residenceMozambique, 18)}
        </div>
        <div>
          Endereço da residência em Quénia {show(form.residenceKenya, 26)} Localidade {show(form.location, 20)}
        </div>
        <div>
          Distrito {show(form.district, 16)} Telefone Celular {show(form.cellPhone, 26)}
        </div>
      </div>

      {/* Spouse */}
      <div style={{
        border: "1.5px solid #222",
        marginBottom: 0,
        padding: "2px 10px 2px 10px",
        fontWeight: "bold",
        textAlign: "center",
        background: "#fff"
      }}>
        DADOS DE CÔNJUGE
      </div>
      <div style={{
        border: "1.5px solid #222",
        marginBottom: 10,
        padding: "2px 10px 2px 10px"
      }}>
        <div>
          Nome completo {show(form.spouse?.fullName, 60)}
        </div>
        <div>
          Nacionalidade {show(form.spouse?.nationality, 16)} Documento de identificação {show(form.spouse?.idDocument, 36)}
        </div>
        <div>
          Profissão {show(form.spouse?.profession, 24)} Local de trabalho {show(form.spouse?.workplace, 26)} Celular Nº {show(form.spouse?.cellPhone, 18)}
        </div>
      </div>

      {/* Family in Mozambique */}
      <div style={{
        border: "1.5px solid #222",
        marginBottom: 10,
        padding: 0
      }}>
        <div style={{
          fontWeight: "bold",
          textAlign: "center",
          padding: "2px 0 2px 0"
        }}>
          FAMILIARES EM MOÇAMBIQUE
        </div>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tdStyle}>Nomes</th>
              <th style={tdStyle}>Grau de parentesco</th>
              <th style={tdStyle}>Residência / contacto</th>
            </tr>
          </thead>
          <tbody>
            {fillRows(form.familyMozambique, 3, ["name", "relationship", "residence"]).map((f, i) => (
              <tr key={i}>
                <td style={tdStyle}>{show(f.name, 18)}</td>
                <td style={tdStyle}>{show(f.relationship, 18)}</td>
                <td style={tdStyle}>{show(f.residence, 24)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Next Page: Family Under 15 */}
      <div style={{
        pageBreakBefore: "always",
        marginTop: 10
      }}>
        <div style={{
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 2
        }}>
          PESSOAL DA FAMÍLIA A SEU CARGO
        </div>
        <div style={{
          textAlign: "center",
          fontSize: "0.96em",
          marginBottom: 5
        }}>
          (Menores de 15 anos)
        </div>
        <div style={{
          border: "1.5px solid #222",
          marginBottom: 10,
          padding: 0
        }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={tdStyle}>Nomes</th>
                <th style={tdStyle}>Grau de parentesco</th>
                <th style={tdStyle}>Idade</th>
              </tr>
            </thead>
            <tbody>
              {fillRows(form.familyUnder15, 2, ["name", "relationship", "age"]).map((f, i) => (
                <tr key={i}>
                  <td style={tdStyle}>{show(f.name, 18)}</td>
                  <td style={tdStyle}>{show(f.relationship, 18)}</td>
                  <td style={tdStyle}>{show(f.age, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Consular Card */}
        <div style={{
          fontWeight: "bold",
          textAlign: "center",
          margin: "7px 0 1px 0"
        }}>
          CARTÃO DE INSCRIÇÃO CONSULAR CONCEDIDOS
        </div>
        <div style={{
          border: "1.5px solid #222",
          marginBottom: 10,
          padding: "2px 10px 2px 10px"
        }}>
          Número de cartão {show(form.consularCardNumber, 32)} Data de Emissão {show(form.consularCardIssueDate, 16)}
        </div>

        {/* Passports */}
        <div style={{
          fontWeight: "bold",
          textAlign: "center",
          margin: "7px 0 1px 0"
        }}>
          BILHETE DE IDENTIDADE/ PASSAPORTES CONCEDIDOS
        </div>
        <div style={{
          border: "1.5px solid #222",
          marginBottom: 10,
          padding: 0
        }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={tdStyle}>Número</th>
                <th style={tdStyle}>Data</th>
                <th style={tdStyle}>Prazo de Validade</th>
                <th style={tdStyle}>Países</th>
              </tr>
            </thead>
            <tbody>
              {fillRows(form.passports, 2, ["number", "issueDate", "expiryDate", "country"]).map((p, i) => (
                <tr key={i}>
                  <td style={tdStyle}>{show(p.number, 12)}</td>
                  <td style={tdStyle}>{show(p.issueDate, 12)}</td>
                  <td style={tdStyle}>{show(p.expiryDate, 14)}</td>
                  <td style={tdStyle}>{show(p.country, 14)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Repatriations */}
        <div style={{
          fontWeight: "bold",
          textAlign: "center",
          margin: "7px 0 1px 0"
        }}>
          REPATRIAÇÕES
        </div>
        <div style={{
          border: "1.5px solid #222",
          marginBottom: 10,
          padding: 0
        }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={tdStyle}>Data</th>
                <th style={tdStyle}>Condições</th>
                <th style={tdStyle}>Encargos para o Estado</th>
              </tr>
            </thead>
            <tbody>
              {fillRows(form.repatriations, 2, ["date", "conditions", "charges"]).map((r, i) => (
                <tr key={i}>
                  <td style={tdStyle}>{show(r.date, 12)}</td>
                  <td style={tdStyle}>{show(r.conditions, 20)}</td>
                  <td style={tdStyle}>{show(r.charges, 18)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Civil/Notary Acts */}
        <div style={{
          fontWeight: "bold",
          textAlign: "center",
          margin: "7px 0 1px 0"
        }}>
          ACTOS DE REGISTO CIVIL E NOTARIADO
        </div>
        <div style={{
          border: "1.5px solid #222",
          minHeight: 70,
          marginBottom: 10,
          padding: "6px 8px"
        }}>
          {form.civilActs
            ? <div>{form.civilActs}</div>
            : [...Array(4)].map((_, i) => (
                <div key={i}><Dots length={110}/></div>
              ))
          }
        </div>

        {/* Footer: Place, Date, Observations */}
        <div style={{
          margin: "26px 0 0 0",
          fontSize: "1em"
        }}>
          <span>
            Mombasa, aos <Dots length={10}/> de <Dots length={20}/> de 20<Dots length={2}/>
          </span>
        </div>
        <div style={{marginTop: 6}}>
          Observações {show(form.observations, 70)}
        </div>
      </div>
    </div>
  );
}