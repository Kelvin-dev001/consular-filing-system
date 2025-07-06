import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  TextField,
  IconButton,
  Divider,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SendIcon from "@mui/icons-material/Send";
import { useTranslation } from "react-i18next";
import API from "../../utils/api";
import "./RegistrationWizard.css";
import ConfirmationPage from "./ConfirmationPage";

const initialForm = {
  fileNumber: "",
  issuedOn: "",
  validity: "",
  fullName: "",
  countryPlaceOfBirth: "",
  birthDate: "",
  maritalStatus: "",
  fatherName: "",
  motherName: "",
  education: "",
  profession: "",
  workplaceOrSchool: "",
  phone: "",
  passportOrIdNumber: "",
  passportIssuedAt: "",
  passportValidUntil: "",
  residenceKenya: "",
  residenceMozambique: "",
  district: "",
  cellPhone: "",
  documentsPresented: "",
  currentResidence: "",
  observations: "",
  spouse: {
    fullName: "",
    nationality: "",
    idDocument: "",
    profession: "",
    workplace: "",
    cellPhone: "",
  },
  familyMozambique: [{ name: "", relationship: "", residence: "" }],
  familyUnder15: [{ name: "", relationship: "", age: "" }],
  consularCardNumber: "",
  consularCardIssueDate: "",
  passports: [{ number: "", issueDate: "", expiryDate: "", country: "" }],
  repatriations: [{ date: "", conditions: "", charges: "" }],
  civilActs: "",
  passportPhoto: null,
  formImages: [],
};

const steps = [
  "Consular Registration",
  "Personal Info",
  "Spouse Info",
  "Family in Mozambique",
  "Family <15 (Kenya)",
  "Consular Card",
  "ID/Passports",
  "Repatriations",
  "Civil/Notary Acts",
  "Observations & Attachments",
];

export default function RegistrationWizard() {
  const [form, setForm] = useState(initialForm);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { t } = useTranslation();

  // -------- Field Handlers --------
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSpouseChange = (e) =>
    setForm({
      ...form,
      spouse: { ...form.spouse, [e.target.name]: e.target.value },
    });

  // Array: Family Mozambique
  const handleFamilyMozChange = (idx, e) => {
    const updated = form.familyMozambique.map((f, i) =>
      i === idx ? { ...f, [e.target.name]: e.target.value } : f
    );
    setForm({ ...form, familyMozambique: updated });
  };
  const addFamilyMoz = () =>
    setForm({
      ...form,
      familyMozambique: [
        ...form.familyMozambique,
        { name: "", relationship: "", residence: "" },
      ],
    });
  const removeFamilyMoz = (idx) =>
    setForm({
      ...form,
      familyMozambique: form.familyMozambique.filter((_, i) => i !== idx),
    });

  // Array: Family Under 15
  const handleFamilyUnder15Change = (idx, e) => {
    const updated = form.familyUnder15.map((f, i) =>
      i === idx ? { ...f, [e.target.name]: e.target.value } : f
    );
    setForm({ ...form, familyUnder15: updated });
  };
  const addFamilyUnder15 = () =>
    setForm({
      ...form,
      familyUnder15: [
        ...form.familyUnder15,
        { name: "", relationship: "", age: "" },
      ],
    });
  const removeFamilyUnder15 = (idx) =>
    setForm({
      ...form,
      familyUnder15: form.familyUnder15.filter((_, i) => i !== idx),
    });

  // Array: Passports
  const handlePassportsChange = (idx, e) => {
    const updated = form.passports.map((p, i) =>
      i === idx ? { ...p, [e.target.name]: e.target.value } : p
    );
    setForm({ ...form, passports: updated });
  };
  const addPassport = () =>
    setForm({
      ...form,
      passports: [
        ...form.passports,
        { number: "", issueDate: "", expiryDate: "", country: "" },
      ],
    });
  const removePassport = (idx) =>
    setForm({
      ...form,
      passports: form.passports.filter((_, i) => i !== idx),
    });

  // Array: Repatriations
  const handleRepatriationsChange = (idx, e) => {
    const updated = form.repatriations.map((r, i) =>
      i === idx ? { ...r, [e.target.name]: e.target.value } : r
    );
    setForm({ ...form, repatriations: updated });
  };
  const addRepatriation = () =>
    setForm({
      ...form,
      repatriations: [
        ...form.repatriations,
        { date: "", conditions: "", charges: "" },
      ],
    });
  const removeRepatriation = (idx) =>
    setForm({
      ...form,
      repatriations: form.repatriations.filter((_, i) => i !== idx),
    });

  const handleFileChange = (e) =>
    setForm({ ...form, passportPhoto: e.target.files[0] });

  // -------- Navigation --------
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // -------- Submission --------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      let photoUrl = "";
      if (form.passportPhoto) {
        const formData = new FormData();
        formData.append("file", form.passportPhoto);
        const uploadRes = await API.post("/upload/single", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        photoUrl = uploadRes.data.filePath || uploadRes.data.url;
      }
      const dataToSend = {
        ...form,
        passportPhoto: photoUrl,
      };
      await API.post("/registrations", dataToSend);
      setMessage(
        t("registrationSuccess") ||
        "Registration submitted successfully! You may now print or save your registration."
      );
      setSnackbarOpen(true);
      setSubmitted(true);
    } catch (err) {
      let userMessage = "";
      if (err.response?.data?.message) {
        userMessage =
          typeof err.response.data.message === "string"
            ? err.response.data.message
            : JSON.stringify(err.response.data.message);
      } else if (err.message) {
        userMessage = err.message;
      } else {
        userMessage = t("submissionFailed") || "Submission failed. Please try again.";
      }
      setError(userMessage);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // -------- Step Content --------
  // Full getStepContent function as you provided
  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">
                {t("registrationForm") || "Registration Form"}: Consular Registration
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Please enter consular registration details.
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label={t("fileNumber") || "Consular Registration No."}
                name="fileNumber"
                fullWidth
                value={form.fileNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label={t("issuedOn") || "Issued On"}
                name="issuedOn"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={form.issuedOn}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label={t("validity") || "Validity"}
                name="validity"
                fullWidth
                value={form.validity}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">
                {t("registrationForm") || "Registration Form"}: Personal Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Enter your personal details as required.
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("fullName") || "Full Name"}
                name="fullName"
                fullWidth
                value={form.fullName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("countryPlaceOfBirth") || "Country/Place of Birth"}
                name="countryPlaceOfBirth"
                fullWidth
                value={form.countryPlaceOfBirth}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label={t("birthDate") || "Date of Birth"}
                name="birthDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={form.birthDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label={t("maritalStatus") || "Marital Status"}
                name="maritalStatus"
                fullWidth
                value={form.maritalStatus}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label={t("profession") || "Profession"}
                name="profession"
                fullWidth
                value={form.profession}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("fatherName") || "Father's Name"}
                name="fatherName"
                fullWidth
                value={form.fatherName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("motherName") || "Mother's Name"}
                name="motherName"
                fullWidth
                value={form.motherName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("education") || "Education"}
                name="education"
                fullWidth
                value={form.education}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("workplaceOrSchool") || "Workplace/School"}
                name="workplaceOrSchool"
                fullWidth
                value={form.workplaceOrSchool}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("phone") || "Phone"}
                name="phone"
                fullWidth
                value={form.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("cellPhone") || "Cell Phone"}
                name="cellPhone"
                fullWidth
                value={form.cellPhone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("passportOrIdNumber") || "Passport/ID Number"}
                name="passportOrIdNumber"
                fullWidth
                value={form.passportOrIdNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("passportIssuedAt") || "Passport Issued At"}
                name="passportIssuedAt"
                fullWidth
                value={form.passportIssuedAt}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("passportValidUntil") || "Passport Valid Until"}
                name="passportValidUntil"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={form.passportValidUntil}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("residenceKenya") || "Residence in Kenya"}
                name="residenceKenya"
                fullWidth
                value={form.residenceKenya}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("residenceMozambique") || "Residence in Mozambique"}
                name="residenceMozambique"
                fullWidth
                value={form.residenceMozambique}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("district") || "District"}
                name="district"
                fullWidth
                value={form.district}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("documentsPresented") || "Documents Presented"}
                name="documentsPresented"
                fullWidth
                value={form.documentsPresented}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t("currentResidence") || "Current Residence"}
                name="currentResidence"
                fullWidth
                value={form.currentResidence}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">
                {t("registrationForm") || "Registration Form"}: Spouse Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Enter spouse details if applicable.
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("spouseFullName") || "Spouse Full Name"}
                name="fullName"
                fullWidth
                value={form.spouse.fullName}
                onChange={handleSpouseChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("spouseNationality") || "Spouse Nationality"}
                name="nationality"
                fullWidth
                value={form.spouse.nationality}
                onChange={handleSpouseChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("spouseIdDocument") || "Spouse ID Document"}
                name="idDocument"
                fullWidth
                value={form.spouse.idDocument}
                onChange={handleSpouseChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("spouseProfession") || "Spouse Profession"}
                name="profession"
                fullWidth
                value={form.spouse.profession}
                onChange={handleSpouseChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("spouseWorkplace") || "Spouse Workplace"}
                name="workplace"
                fullWidth
                value={form.spouse.workplace}
                onChange={handleSpouseChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("spouseCellPhone") || "Spouse Cell Phone"}
                name="cellPhone"
                fullWidth
                value={form.spouse.cellPhone}
                onChange={handleSpouseChange}
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">
                {t("familyMozambique") || "Family in Mozambique"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                List close family members living in Mozambique.
              </Typography>
            </Grid>
            {form.familyMozambique.map((item, idx) => (
              <React.Fragment key={`familyMoz-${idx}`}>
                <Grid item xs={4}>
                  <TextField
                    label={t("familyMozambiqueName") || "Name"}
                    name="name"
                    fullWidth
                    value={item.name}
                    onChange={(e) => handleFamilyMozChange(idx, e)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label={t("familyMozambiqueRelationship") || "Relationship"}
                    name="relationship"
                    fullWidth
                    value={item.relationship}
                    onChange={(e) => handleFamilyMozChange(idx, e)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label={t("familyMozambiqueResidence") || "Residence"}
                    name="residence"
                    fullWidth
                    value={item.residence}
                    onChange={(e) => handleFamilyMozChange(idx, e)}
                  />
                </Grid>
                <Grid item xs={1} alignSelf="center">
                  <Tooltip title="Remove">
                    <span>
                      <IconButton
                        color="error"
                        onClick={() => removeFamilyMoz(idx)}
                        disabled={form.familyMozambique.length === 1}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button
                onClick={addFamilyMoz}
                startIcon={<AddCircleIcon />}
                variant="outlined"
              >
                {t("add") || "Add"}
              </Button>
            </Grid>
          </Grid>
        );
      case 4:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">
                {t("familyUnder15") || "Family Under 15 (Kenya)"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                List family members under 15 living in Kenya.
              </Typography>
            </Grid>
            {form.familyUnder15.map((item, idx) => (
              <React.Fragment key={`familyUnder15-${idx}`}>
                <Grid item xs={4}>
                  <TextField
                    label={t("familyUnder15Name") || "Name"}
                    name="name"
                    fullWidth
                    value={item.name}
                    onChange={(e) => handleFamilyUnder15Change(idx, e)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label={t("familyUnder15Relationship") || "Relationship"}
                    name="relationship"
                    fullWidth
                    value={item.relationship}
                    onChange={(e) => handleFamilyUnder15Change(idx, e)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label={t("familyUnder15Age") || "Age"}
                    name="age"
                    type="number"
                    fullWidth
                    value={item.age}
                    onChange={(e) => handleFamilyUnder15Change(idx, e)}
                  />
                </Grid>
                <Grid item xs={1} alignSelf="center">
                  <Tooltip title="Remove">
                    <span>
                      <IconButton
                        color="error"
                        onClick={() => removeFamilyUnder15(idx)}
                        disabled={form.familyUnder15.length === 1}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button
                onClick={addFamilyUnder15}
                startIcon={<AddCircleIcon />}
                variant="outlined"
              >
                {t("add") || "Add"}
              </Button>
            </Grid>
          </Grid>
        );
      case 5:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">
                {t("consularCard") || "Consular Card"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Provide consular card details.
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("consularCardNumber") || "Card Number"}
                name="consularCardNumber"
                fullWidth
                value={form.consularCardNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("consularCardIssueDate") || "Issue Date"}
                name="consularCardIssueDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={form.consularCardIssueDate}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 6:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">
                {t("idPassports") || "ID/Passports"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Add your ID or passport details.
              </Typography>
            </Grid>
            {form.passports.map((item, idx) => (
              <React.Fragment key={`passport-${idx}`}>
                <Grid item xs={3}>
                  <TextField
                    label={t("passportOrIdNumber") || "Number"}
                    name="number"
                    fullWidth
                    value={item.number}
                    onChange={(e) => handlePassportsChange(idx, e)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label={t("passportIssuedAt") || "Issue Date"}
                    name="issueDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={item.issueDate}
                    onChange={(e) => handlePassportsChange(idx, e)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label={t("passportValidUntil") || "Expiry Date"}
                    name="expiryDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={item.expiryDate}
                    onChange={(e) => handlePassportsChange(idx, e)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    label={t("country") || "Country"}
                    name="country"
                    fullWidth
                    value={item.country}
                    onChange={(e) => handlePassportsChange(idx, e)}
                  />
                </Grid>
                <Grid item xs={1} alignSelf="center">
                  <Tooltip title="Remove">
                    <span>
                      <IconButton
                        color="error"
                        onClick={() => removePassport(idx)}
                        disabled={form.passports.length === 1}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button
                onClick={addPassport}
                startIcon={<AddCircleIcon />}
                variant="outlined"
              >
                {t("add") || "Add"}
              </Button>
            </Grid>
          </Grid>
        );
      case 7:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">
                {t("repatriations") || "Repatriations"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Provide details of any repatriations.
              </Typography>
            </Grid>
            {form.repatriations.map((item, idx) => (
              <React.Fragment key={`repatriation-${idx}`}>
                <Grid item xs={4}>
                  <TextField
                    label={t("date") || "Date"}
                    name="date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={item.date}
                    onChange={(e) => handleRepatriationsChange(idx, e)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label={t("conditions") || "Conditions"}
                    name="conditions"
                    fullWidth
                    value={item.conditions}
                    onChange={(e) => handleRepatriationsChange(idx, e)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label={t("charges") || "Charges"}
                    name="charges"
                    fullWidth
                    value={item.charges}
                    onChange={(e) => handleRepatriationsChange(idx, e)}
                  />
                </Grid>
                <Grid item xs={1} alignSelf="center">
                  <Tooltip title="Remove">
                    <span>
                      <IconButton
                        color="error"
                        onClick={() => removeRepatriation(idx)}
                        disabled={form.repatriations.length === 1}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button
                onClick={addRepatriation}
                startIcon={<AddCircleIcon />}
                variant="outlined"
              >
                {t("add") || "Add"}
              </Button>
            </Grid>
          </Grid>
        );
      case 8:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">
                {t("civilActs") || "Civil/Notary Acts"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                List any civil or notary acts here.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t("civilActs") || "Civil/Notary Acts"}
                name="civilActs"
                fullWidth
                multiline
                minRows={4}
                value={form.civilActs}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 9:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">
                {t("observations") || "Observations & Attachments"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Add any final remarks and upload a passport photo.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t("observations") || "Observations"}
                name="observations"
                fullWidth
                multiline
                minRows={3}
                value={form.observations}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                {t("passportPhoto") || "Passport Photo"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mb: 1 }}
              >
                {t("uploadNewPhoto") || "Upload New Photo"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              {form.passportPhoto && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {form.passportPhoto.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                {t("formImages") || "Additional Images"}
              </Typography>
              {/* You can add additional images logic here if needed */}
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  }

  // -------- Snackbar Close Handler --------
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  // -------- Render --------
  if (submitted) {
    return <ConfirmationPage form={form} />;
  }

  return (
    <Box className="registration-wizard-container">
      <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, maxWidth: 850, margin: "auto" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, i) => (
            <Step key={i}>
              <StepLabel>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: i === activeStep ? "#b10056" : "#7c2352",
                    fontSize: { xs: "0.85em", sm: "1em" },
                  }}
                >
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Divider sx={{ my: 2 }} />
        <form onSubmit={handleSubmit} autoComplete="off">
          <Box sx={{ pt: 2 }}>{getStepContent(activeStep)}</Box>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {message && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}
          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Button
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
              startIcon={<ArrowBackIosNewIcon />}
              variant="text"
              sx={{ textTransform: "none", minWidth: 100 }}
            >
              {t("back") || "Back"}
            </Button>
            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForwardIosIcon />}
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                {t("next") || "Next"}
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={
                  loading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <SendIcon />
                  )
                }
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                {loading ? (t("submitting") || "Submitting...") : t("submit") || "Submit"}
              </Button>
            )}
          </Box>
        </form>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          {error ? (
            <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          ) : message ? (
            <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
              {message}
            </Alert>
          ) : null}
        </Snackbar>
      </Paper>
    </Box>
  );
}