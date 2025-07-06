import React from "react";
import styles from './RegistrationFormPrintable.module.css';

const RegistrationFormPrintable = React.forwardRef(({ form }, ref) => (
  <div ref={ref} className={styles.printableForm}>
    {/* --- Form Header --- */}
    <div className={styles.header}>
      REPÚBLICA DE MOÇAMBIQUE<br />
      CONSULADO DA REPÚBLICA DE MOÇAMBIQUE EM MOMBASA
    </div>
    <div className={styles.sectionTitle}>
      INSCRIÇÃO CONSULAR
    </div>
    <div style={{ marginTop: 20 }}>
      <b>INSC. CONSULAR Nº:</b> {form?.fileNumber || ""}
      <br />
      <b>DATA DE EMISSÃO:</b> {form?.issuedOn || ""}
      <br />
      <b>VALIDADE:</b> {form?.validity || ""}
    </div>
    <hr style={{ margin: "20px 0" }} />

    {/* --- Personal Info --- */}
    <div>
      <div className={styles.sectionTitle}>Dados Pessoais</div>
      <div>Nome completo: {form?.fullName || ""}</div>
      <div>País e local de nascimento: {form?.countryPlaceOfBirth || ""}</div>
      <div>Data de nascimento: {form?.birthDate || ""}</div>
      <div>Estado civil: {form?.maritalStatus || ""}</div>
      <div>Nome do pai: {form?.fatherName || ""}</div>
      <div>Nome da mãe: {form?.motherName || ""}</div>
      <div>Habilitações literárias: {form?.education || ""}</div>
      <div>Profissão: {form?.profession || ""}</div>
      <div>Local de trabalho/escola: {form?.workplaceOrSchool || ""}</div>
      <div>Telefone: {form?.phone || ""}</div>
      <div>Telemóvel: {form?.cellPhone || ""}</div>
      <div>Passaporte/BI Nº: {form?.passportOrIdNumber || ""}</div>
      <div>Emitido em: {form?.passportIssuedAt || ""}</div>
      <div>Válido até: {form?.passportValidUntil || ""}</div>
      <div>Residência em Quénia: {form?.residenceKenya || ""}</div>
      <div>Residência em Moçambique: {form?.residenceMozambique || ""}</div>
      <div>Distrito: {form?.district || ""}</div>
      <div>Documentos apresentados: {form?.documentsPresented || ""}</div>
      <div>Residência actual: {form?.currentResidence || ""}</div>
    </div>
    <hr style={{ margin: "20px 0" }} />

    {/* --- Spouse Info --- */}
    <div>
      <div className={styles.sectionTitle}>Dados de Cônjuge</div>
      <div>Nome completo: {form?.spouse?.fullName || ""}</div>
      <div>Nacionalidade: {form?.spouse?.nationality || ""}</div>
      <div>Documento de identificação: {form?.spouse?.idDocument || ""}</div>
      <div>Profissão: {form?.spouse?.profession || ""}</div>
      <div>Local de trabalho: {form?.spouse?.workplace || ""}</div>
      <div>Celular: {form?.spouse?.cellPhone || ""}</div>
    </div>
    <hr style={{ margin: "20px 0" }} />

    {/* --- Family Mozambique --- */}
    <div>
      <div className={styles.sectionTitle}>Familiares em Moçambique</div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Grau de parentesco</th>
            <th>Residência / contacto</th>
          </tr>
        </thead>
        <tbody>
          {(form?.familyMozambique || []).map((f, i) => (
            <tr key={i}>
              <td>{f.name}</td>
              <td>{f.relationship}</td>
              <td>{f.residence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <hr style={{ margin: "20px 0" }} />

    {/* --- Family Under 15 --- */}
    <div>
      <div className={styles.sectionTitle}>
        Pessoal da família a seu cargo (menores de 15 anos)
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Grau de parentesco</th>
            <th>Idade</th>
          </tr>
        </thead>
        <tbody>
          {(form?.familyUnder15 || []).map((f, i) => (
            <tr key={i}>
              <td>{f.name}</td>
              <td>{f.relationship}</td>
              <td>{f.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <hr style={{ margin: "20px 0" }} />

    {/* --- Consular Card --- */}
    <div>
      <div className={styles.sectionTitle}>Cartão de inscrição consular concedidos</div>
      <table className={styles.table}>
        <tbody>
          <tr>
            <td>Número de cartão: {form?.consularCardNumber || ""}</td>
            <td>Data de emissão: {form?.consularCardIssueDate || ""}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <hr style={{ margin: "20px 0" }} />

    {/* --- Passports Concedidos --- */}
    <div>
      <div className={styles.sectionTitle}>Bilhete de Identidade/ Passaportes Concedidos</div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Número</th>
            <th>Data</th>
            <th>Prazo de Validade</th>
            <th>Países</th>
          </tr>
        </thead>
        <tbody>
          {(form?.passports || []).map((p, i) => (
            <tr key={i}>
              <td>{p.number}</td>
              <td>{p.issueDate}</td>
              <td>{p.expiryDate}</td>
              <td>{p.country}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <hr style={{ margin: "20px 0" }} />

    {/* --- Repatriations --- */}
    <div>
      <div className={styles.sectionTitle}>Repatriações</div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Condições</th>
            <th>Encargos para o Estado</th>
          </tr>
        </thead>
        <tbody>
          {(form?.repatriations || []).map((r, i) => (
            <tr key={i}>
              <td>{r.date}</td>
              <td>{r.conditions}</td>
              <td>{r.charges}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <hr style={{ margin: "20px 0" }} />

    {/* --- Civil and Notary Acts --- */}
    <div>
      <div className={styles.sectionTitle}>Actos de Registo Civil e Notariado</div>
      <div className={styles.dottedLine}></div>
      <div>{form?.civilActs || ""}</div>
      <div className={styles.dottedLine}></div>
    </div>
    <hr style={{ margin: "20px 0" }} />

    {/* --- Observations --- */}
    <div>
      <div className={styles.sectionTitle}>Observações</div>
      <div className={styles.dottedLine}></div>
      <div>{form?.observations || ""}</div>
    </div>

    {/* --- Footer --- */}
    <div className={styles.footerRow}>
      <span>Mombasa, aos _______ de ________________ de 20_____</span>
      <span></span>
    </div>
  </div>
));

export default RegistrationFormPrintable;