import React from "react";
import styles from "./RegistrationFormPrintable.module.css";

// Helper for dotted lines
const Dots = ({ length = 30 }) => (
  <span style={{ letterSpacing: "2px", fontFamily: "monospace" }}>
    {".".repeat(length)}
  </span>
);

export default function RegistrationFormPrintable({ form }) {
  const show = (val, len = 20) =>
    val && val !== "" ? <span>{val}</span> : <Dots length={len} />;

  // Always show the photo box (even if no photo)
  const passPhoto = form?.passportPhoto ? (
    <img
      src={
        typeof form.passportPhoto === "string"
          ? form.passportPhoto
          : URL.createObjectURL(form.passportPhoto)
      }
      alt="Passaporte"
      className={styles.photoPreview}
    />
  ) : null;

  const tableStyle = `${styles.table}`;

  const fillRows = (arr, n, cols) =>
    [...Array(Math.max(n, arr?.length || 0))].map((_, i) => arr?.[i] || Object.fromEntries(cols.map(c => [c, ""])));

  return (
    <div className={styles.printableForm}>
      {/* HEADER */}
      <div className={styles.logoRow}>
        <img
          src="/emblem-mozambique.jpeg"
          alt="Emblema"
          className={styles.logoImg}
        />
      </div>
      <div className={styles.headerTextBlock}>
        <div className={styles.headerLine}>
          REPÚBLICA DE MOÇAMBIQUE
        </div>
        <div className={styles.headerLine}>
          CONSULADO DA REPÚBLICA DE
        </div>
        <div className={styles.headerLine}>
          MOÇAMBIQUE EM MOMBASA
        </div>
      </div>

      {/* Row: Title and photo box */}
      <div className={styles.headerRowFlex}>
        <div className={styles.titlesBlock}>
          <div className={styles.formTitle}>
            INSCRIÇÃO CONSULAR
          </div>
        </div>
        {/* Always render photo box, even if empty */}
        <div className={styles.photoBox}>
          {passPhoto}
        </div>
      </div>

      {/* Consular info */}
      <div className={styles.metaSection}>
        <div>
          <b>INSC. CONSULAR Nº</b> {show(form.fileNumber, 30)}
        </div>
        <div>
          <b>DATA DE EMISSÃO</b> {show(form.issuedOn, 18)} <b>VALIDADE</b> {show(form.validity, 18)}
        </div>
      </div>

      {/* Personal Information */}
      <div className={styles.sectionTitlePrint}>Dados Pessoais</div>
      <div style={{
        border: "2px solid #222",
        marginBottom: 18,
        padding: "10px 18px",
        minHeight: "220px",
        background: "#fff"
      }}>
        <div style={{marginBottom: 12}}>Nome completo {show(form.fullName, 70)}</div>
        <div style={{marginBottom: 12}}>País e local de nascimento {show(form.countryPlaceOfBirth, 56)}</div>
        <div style={{marginBottom: 12}}>Data de Nascimento {show(form.birthDate, 12)} &nbsp; Estado Civil {show(form.maritalStatus, 20)}</div>
        <div style={{marginBottom: 12}}>Nome do Pai {show(form.fatherName, 56)}</div>
        <div style={{marginBottom: 12}}>Nome da Mãe {show(form.motherName, 56)}</div>
        <div style={{marginBottom: 12}}>Habilitações Literárias {show(form.education, 14)} profissão {show(form.profession, 20)} Local de trabalho {show(form.workplaceOrSchool, 22)}</div>
        <div style={{marginBottom: 12}}>Telefone {show(form.phone, 16)} (Estudante, local de ensino) {show(form.workplaceOrSchool, 32)}</div>
        <div style={{marginBottom: 12}}>Portador de passaporte/C. Emergencia/BI/Cédula pessoal Nº {show(form.passportOrIdNumber, 30)} Emitido em {show(form.passportIssuedAt, 16)}</div>
        <div style={{marginBottom: 12}}>Válido até {show(form.passportValidUntil, 16)} Última residência em Moçambique {show(form.residenceMozambique, 18)}</div>
        <div style={{marginBottom: 12}}>Endereço da residência em Quénia {show(form.residenceKenya, 26)} Localidade {show(form.location, 20)}</div>
        <div>Distrito {show(form.district, 16)} Telefone Celular {show(form.cellPhone, 26)}</div>
      </div>

      {/* Spouse */}
      <div className={styles.sectionTitlePrint}>DADOS DE CÔNJUGE</div>
      <div style={{
        border: "2px solid #222",
        marginBottom: 18,
        padding: "10px 18px",
        background: "#fff",
        minHeight: "80px"
      }}>
        <div style={{marginBottom: 12}}>Nome completo {show(form.spouse?.fullName, 60)}</div>
        <div style={{marginBottom: 12}}>Nacionalidade {show(form.spouse?.nationality, 16)} Documento de identificação {show(form.spouse?.idDocument, 36)}</div>
        <div>Profissão {show(form.spouse?.profession, 24)} Local de trabalho {show(form.spouse?.workplace, 26)} Celular Nº {show(form.spouse?.cellPhone, 18)}</div>
      </div>

      {/* Family in Mozambique */}
      <div className={styles.sectionTitlePrint}>FAMILIARES EM MOÇAMBIQUE</div>
      <table className={tableStyle}>
        <thead>
          <tr>
            <th style={{minWidth:60}}>Nomes</th>
            <th>Grau de parentesco</th>
            <th style={{minWidth:110}}>Residência / contacto</th>
          </tr>
        </thead>
        <tbody>
          {fillRows(form.familyMozambique, 3, ["name", "relationship", "residence"]).map((f, i) => (
            <tr key={i}>
              <td>{show(f.name, 18)}</td>
              <td>{show(f.relationship, 18)}</td>
              <td>{show(f.residence, 24)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Next Page: Family Under 15 */}
      <div style={{ pageBreakBefore: "always", marginTop: 10 }}>
        <div className={styles.sectionTitlePrint}>PESSOAL DA FAMÍLIA A SEU CARGO</div>
        <div style={{ textAlign: "center", fontSize: "0.96em", marginBottom: 12 }}>(Menores de 15 anos)</div>
        <table className={tableStyle}>
          <thead>
            <tr>
              <th style={{minWidth:60}}>Nomes</th>
              <th>Grau de parentesco</th>
              <th style={{minWidth:60}}>Idade</th>
            </tr>
          </thead>
          <tbody>
            {fillRows(form.familyUnder15, 2, ["name", "relationship", "age"]).map((f, i) => (
              <tr key={i}>
                <td>{show(f.name, 18)}</td>
                <td>{show(f.relationship, 18)}</td>
                <td>{show(f.age, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Consular Card */}
        <div className={styles.sectionTitlePrint}>CARTÃO DE INSCRIÇÃO CONSULAR CONCEDIDOS</div>
        <div style={{
          border: "2px solid #222",
          marginBottom: 18,
          padding: "10px 18px",
          minHeight: "48px",
          background: "#fff"
        }}>
          Número de cartão {show(form.consularCardNumber, 32)} Data de Emissão {show(form.consularCardIssueDate, 16)}
        </div>

        {/* Passports */}
        <div className={styles.sectionTitlePrint}>BILHETE DE IDENTIDADE/ PASSAPORTES CONCEDIDOS</div>
        <table className={tableStyle}>
          <thead>
            <tr>
              <th>Número</th>
              <th>Data</th>
              <th>Prazo de Validade</th>
              <th>Países</th>
            </tr>
          </thead>
          <tbody>
            {fillRows(form.passports, 2, ["number", "issueDate", "expiryDate", "country"]).map((p, i) => (
              <tr key={i}>
                <td>{show(p.number, 12)}</td>
                <td>{show(p.issueDate, 12)}</td>
                <td>{show(p.expiryDate, 14)}</td>
                <td>{show(p.country, 14)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Repatriations */}
        <div className={styles.sectionTitlePrint}>REPATRIAÇÕES</div>
        <table className={tableStyle}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Condições</th>
              <th>Encargos para o Estado</th>
            </tr>
          </thead>
          <tbody>
            {fillRows(form.repatriations, 2, ["date", "conditions", "charges"]).map((r, i) => (
              <tr key={i}>
                <td>{show(r.date, 12)}</td>
                <td>{show(r.conditions, 20)}</td>
                <td>{show(r.charges, 18)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Civil/Notary Acts */}
        <div className={styles.sectionTitlePrint}>ACTOS DE REGISTO CIVIL E NOTARIADO</div>
        <div style={{
          border: "2px solid #222",
          minHeight: 90,
          marginBottom: 18,
          padding: "16px 18px",
          background: "#fff"
        }}>
          {form.civilActs
            ? <div>{form.civilActs}</div>
            : [...Array(4)].map((_, i) => (
                <div key={i}><Dots length={110}/></div>
              ))
          }
        </div>

        {/* Footer: Place, Date, Observations */}
        <div className={styles.footerRow} style={{marginTop:36}}>
          <span>
            Mombasa, aos <Dots length={10}/> de <Dots length={20}/> de 20<Dots length={2}/>
          </span>
          <span>
            Observações {show(form.observations, 70)}
          </span>
        </div>
      </div>
    </div>
  );
}