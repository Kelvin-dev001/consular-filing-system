import React from "react";
import styles from './RegistrationFormPrintable.module.css';

const EMBLEM_SRC = "/emblem-mozambique.jpeg"; // Update path as needed

const RegistrationFormPrintable = React.forwardRef(({ form }, ref) => (
  <div ref={ref} className={styles.printableForm}>
    {/* --- Logo centered at top --- */}
    <div className={styles.logoRow}>
      <img
        src={EMBLEM_SRC}
        alt="Emblema da República de Moçambique"
        className={styles.logoImg}
      />
    </div>
    {/* --- Header and photo row --- */}
    <div className={styles.headerPhotoRow}>
      <div className={styles.headerBlock}>
        <div className={styles.headerLine}>REPÚBLICA DE MOÇAMBIQUE</div>
        <div className={styles.headerLine}>CONSULADO DA REPÚBLICA DE</div>
        <div className={styles.headerLine}>MOÇAMBIQUE EM MOMBASA</div>
      </div>
      <div className={styles.photoBox}>
        {form?.passportPhoto ? (
          <img
            src={typeof form.passportPhoto === "string" ? form.passportPhoto : URL.createObjectURL(form.passportPhoto)}
            alt="Foto do Passaporte"
            className={styles.photoPreview}
          />
        ) : null}
      </div>
    </div>
    <div className={styles.sectionTitlePrint}>
      INSCRIÇÃO CONSULAR
    </div>
    <div style={{ marginTop: 20, marginBottom: 12 }}>
      <b>INSC. CONSULAR Nº</b> {form?.fileNumber || "_________________________"}
      <br />
      <b>DATA DE EMISSÃO</b> {form?.issuedOn || "____/____/______"}
      <br />
      <b>VALIDADE</b> {form?.validity || "_____/_____/_____"}
    </div>
    <hr style={{ margin: "16px 0" }} />

    {/* --- All Details --- */}
    <div style={{ border: "2px solid #222", padding: "8px", marginBottom: 20 }}>
      <div>Nome completo: {form?.fullName || "______________________________________________"}</div>
      <div>País e local de nascimento: {form?.countryPlaceOfBirth || "______________________________________________"}</div>
      <div>
        Data de Nascimento: {form?.birthDate || "__________"} &nbsp;
        Estado Civil: {form?.maritalStatus || "____________________"}
      </div>
      <div>Nome do Pai: {form?.fatherName || "___________________________"} &nbsp; Nome da mãe: {form?.motherName || "___________________________"}</div>
      <div>
        Habilitações Literárias: {form?.education || "________________"} &nbsp;
        profissão: {form?.profession || "________________"} &nbsp;
        Local de trabalho: {form?.workplaceOrSchool || "_____________________________"}
      </div>
      <div>
        Telefone: {form?.phone || "_________________"} &nbsp;
        (Estudante, local de ensino): {form?.workplaceOrSchool || "_________________________"}
      </div>
      <div>
        Portador de passaporte/C.Emergencial/BI/Cédula pessoal Nº: {form?.passportOrIdNumber || "_____________________"} &nbsp;
        Tipo: {form?.passportOrIdType || "_____________________"} &nbsp;
        Emitido em: {form?.passportIssuedAt || "_________________"}
      </div>
      <div>
        Aos: {form?.issuedOn || "__________"} &nbsp;
        válido até: {form?.passportValidUntil || "__________"} &nbsp;
        Última residência em Moçambique: {form?.residenceMozambique || "________________________"}
      </div>
      <div>
        Endereço da residência em Quénia: {form?.residenceKenya || "________________________"} &nbsp;
        Localidade: {form?.location || "________________________"}
      </div>
      <div>
        Distrito: {form?.district || "_________________"} &nbsp;
        Telefone Celular: {form?.cellPhone || "_________________"}
      </div>
      <div>
        Documentos apresentados: {form?.documentsPresented || "__________________________________________"}
      </div>
      <div>
        Residência actual: {form?.currentResidence || "__________________________________________"}
      </div>
    </div>

    {/* --- Spouse Info --- */}
    <div className={styles.sectionTitle} style={{ marginBottom: 8 }}>DADOS DE CÔNJUGE</div>
    <div style={{ border: "2px solid #222", padding: "8px", marginBottom: 20 }}>
      <div>
        Nome completo: {form?.spouse?.fullName || "_________________________________"} &nbsp;
        Nacionalidade: {form?.spouse?.nationality || "__________________"} &nbsp;
        Documento de identificação: {form?.spouse?.idDocument || "__________________"}
      </div>
      <div>
        Profissão: {form?.spouse?.profession || "___________________"} &nbsp;
        Local de trabalho: {form?.spouse?.workplace || "___________________"} &nbsp;
        Celular Nº: {form?.spouse?.cellPhone || "___________________"}
      </div>
    </div>

    {/* --- Family Mozambique --- */}
    <div className={styles.sectionTitle} style={{ marginBottom: 8 }}>FAMILIARES EM MOÇAMBIQUE</div>
    <table className={styles.table} style={{ border: "2px solid #222" }}>
      <thead>
        <tr>
          <th>Nomes</th>
          <th>Grau de parentesco</th>
          <th>Residência / contacto</th>
        </tr>
      </thead>
      <tbody>
        {(form?.familyMozambique || []).map((f, i) => (
          <tr key={i}>
            <td>{f.name || ""}</td>
            <td>{f.relationship || ""}</td>
            <td>{f.residence || ""}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* --- Family Under 15 --- */}
    {form?.familyUnder15 && form.familyUnder15.length > 0 && (
      <>
        <div className={styles.sectionTitle} style={{ marginBottom: 8 }}>
          Pessoal da família a seu cargo (menores de 15 anos)
        </div>
        <table className={styles.table} style={{ border: "2px solid #222" }}>
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
                <td>{f.name || ""}</td>
                <td>{f.relationship || ""}</td>
                <td>
                  {(f.ageType === "months" && f.age !== "") 
                    ? `${f.age} meses`
                    : (f.ageType === "years" && f.age !== "")
                      ? `${f.age} anos`
                      : (f.age || "")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )}

    {/* --- Consular Card --- */}
    {form?.consularCardNumber || form?.consularCardIssueDate ? (
      <>
        <div className={styles.sectionTitle} style={{ marginBottom: 8 }}>
          Cartão de inscrição consular concedidos
        </div>
        <table className={styles.table} style={{ border: "2px solid #222" }}>
          <tbody>
            <tr>
              <td>Número de cartão: {form?.consularCardNumber || ""}</td>
              <td>Data de emissão: {form?.consularCardIssueDate || ""}</td>
            </tr>
          </tbody>
        </table>
      </>
    ) : null}

    {/* --- Passports Concedidos --- */}
    {form?.passports && form.passports.length > 0 && (
      <>
        <div className={styles.sectionTitle} style={{ marginBottom: 8 }}>
          Bilhete de Identidade/ Passaportes Concedidos
        </div>
        <table className={styles.table} style={{ border: "2px solid #222" }}>
          <thead>
            <tr>
              <th>Número</th>
              <th>Data</th>
              <th>Prazo de Validade</th>
              <th>Países</th>
            </tr>
          </thead>
          <tbody>
            {form.passports.map((p, i) => (
              <tr key={i}>
                <td>{p.number || ""}</td>
                <td>{p.issueDate || ""}</td>
                <td>{p.expiryDate || ""}</td>
                <td>{p.country || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )}

    {/* --- Repatriations --- */}
    {form?.repatriations && form.repatriations.length > 0 && (
      <>
        <div className={styles.sectionTitle} style={{ marginBottom: 8 }}>
          Repatriações
        </div>
        <table className={styles.table} style={{ border: "2px solid #222" }}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Condições</th>
              <th>Encargos para o Estado</th>
            </tr>
          </thead>
          <tbody>
            {form.repatriations.map((r, i) => (
              <tr key={i}>
                <td>{r.date || ""}</td>
                <td>{r.conditions || ""}</td>
                <td>{r.charges || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )}

    {/* --- Civil and Notary Acts --- */}
    {form?.civilActs && (
      <>
        <div className={styles.sectionTitle} style={{ marginBottom: 8 }}>
          Actos de Registo Civil e Notariado
        </div>
        <div className={styles.dottedLine}></div>
        <div>{form.civilActs || ""}</div>
        <div className={styles.dottedLine}></div>
      </>
    )}

    {/* --- Observations --- */}
    {form?.observations && (
      <>
        <div className={styles.sectionTitle} style={{ marginBottom: 8 }}>
          Observações
        </div>
        <div className={styles.dottedLine}></div>
        <div>{form.observations || ""}</div>
      </>
    )}

    {/* --- Attached Uploaded Images --- */}
    {form?.formImages && Array.isArray(form.formImages) && form.formImages.length > 0 && (
      <>
        <div className={styles.sectionTitle} style={{ marginBottom: 8 }}>
          Imagens Anexadas
        </div>
        <div className={styles.imagesRow}>
          {form.formImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Form image ${idx + 1}`}
              className={styles.uploadedImg}
            />
          ))}
        </div>
      </>
    )}

    {/* --- Footer --- */}
    <div className={styles.footerRow}>
      <span>Mombasa, aos _______ de ________________ de 20_____</span>
      <span></span>
    </div>
  </div>
));

export default RegistrationFormPrintable;