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
  Divider
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import API from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./ConsularFileWizard.css";

const initialForm = {
  fileNumber: "",
  name: "",
  openedOn: "",
  spouse: "",
  observations: "",
  passportsGranted: [{ number: "", issueDate: "", expiryDate: "", country: "" }],
  repatriations: [{ date: "", conditions: "", stateCharges: "" }],
  civilNotarialActs: "",
  applicantSignature: "",
  attachment: null
};

export default function ConsularFileWizard() {
  const [form, setForm] = useState(initialForm);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const steps = [
    t("consularFileStepInfo"),
    t("consularFileStepPassports"),
    t("consularFileStepRepatriations"),
    t("consularFileStepCivilActs")
  ];

  // Field Handlers
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePassportsChange = (idx, e) => {
    const updated = form.passportsGranted.map((item, i) =>
      i === idx ? { ...item, [e.target.name]: e.target.value } : item
    );
    setForm({ ...form, passportsGranted: updated });
  };
  const addPassport = () =>
    setForm({
      ...form,
      passportsGranted: [
        ...form.passportsGranted,
        { number: "", issueDate: "", expiryDate: "", country: "" }
      ]
    });
  const removePassport = (idx) =>
    setForm({
      ...form,
      passportsGranted: form.passportsGranted.filter((_, i) => i !== idx)
    });

  const handleRepatriationsChange = (idx, e) => {
    const updated = form.repatriations.map((item, i) =>
      i === idx ? { ...item, [e.target.name]: e.target.value } : item
    );
    setForm({ ...form, repatriations: updated });
  };
  const addRepatriation = () =>
    setForm({
      ...form,
      repatriations: [
        ...form.repatriations,
        { date: "", conditions: "", stateCharges: "" }
      ]
    });
  const removeRepatriation = (idx) =>
    setForm({
      ...form,
      repatriations: form.repatriations.filter((_, i) => i !== idx)
    });

  const handleFileChange = (e) => setForm({ ...form, attachment: e.target.files[0] });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setMessage("");
    try {
      let attachmentUrl = "";
      if (form.attachment) {
        const formData = new FormData();
        formData.append("file", form.attachment);
        const uploadRes = await API.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
        attachmentUrl = uploadRes.data.filePath || uploadRes.data.url;
      }
      await API.post("/consularFile", {
        fileNumber: form.fileNumber,
        name: form.name,
        openedOn: form.openedOn ? new Date(form.openedOn) : null,
        spouse: form.spouse,
        observations: form.observations,
        passportsGranted: form.passportsGranted,
        repatriations: form.repatriations,
        civilNotarialActs: form.civilNotarialActs,
        applicantSignature: form.applicantSignature,
        attachment: attachmentUrl
      });
      setMessage(t("consularFileForm") + " " + t("submit").toLowerCase() + "!");
      setForm(initialForm);
      setActiveStep(0);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || t("submissionFailed") || "Submission failed");
    }
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}><Typography variant="h6">{t("consularFileStepInfo")}</Typography></Grid>
            <Grid item xs={6}><TextField label={t("fileNumber")} name="fileNumber" fullWidth value={form.fileNumber} onChange={handleChange} required /></Grid>
            <Grid item xs={6}><TextField label={t("openedOn")} name="openedOn" type="date" InputLabelProps={{ shrink: true }} fullWidth value={form.openedOn} onChange={handleChange} required /></Grid>
            <Grid item xs={6}><TextField label={t("fullName")} name="name" fullWidth value={form.name} onChange={handleChange} required /></Grid>
            <Grid item xs={6}><TextField label={t("spouse")} name="spouse" fullWidth value={form.spouse} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField label={t("observations")} name="observations" fullWidth multiline minRows={2} value={form.observations} onChange={handleChange} /></Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}><Typography variant="h6">{t("consularFileStepPassports")}</Typography></Grid>
            {form.passportsGranted.map((item, idx) => (
              <React.Fragment key={`passport-${idx}`}>
                <Grid item xs={3}><TextField label={t("number")} name="number" fullWidth value={item.number} onChange={e => handlePassportsChange(idx, e)} /></Grid>
                <Grid item xs={3}><TextField label={t("issueDate")} name="issueDate" type="date" InputLabelProps={{ shrink: true }} fullWidth value={item.issueDate} onChange={e => handlePassportsChange(idx, e)} /></Grid>
                <Grid item xs={3}><TextField label={t("expiryDate")} name="expiryDate" type="date" InputLabelProps={{ shrink: true }} fullWidth value={item.expiryDate} onChange={e => handlePassportsChange(idx, e)} /></Grid>
                <Grid item xs={2}><TextField label={t("country")} name="country" fullWidth value={item.country} onChange={e => handlePassportsChange(idx, e)} /></Grid>
                <Grid item xs={1} alignSelf="center">
                  <IconButton color="error" onClick={() => removePassport(idx)} disabled={form.passportsGranted.length === 1}><RemoveCircleIcon /></IconButton>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}><Button onClick={addPassport} startIcon={<AddCircleIcon />} variant="outlined">{t("add")}</Button></Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}><Typography variant="h6">{t("consularFileStepRepatriations")}</Typography></Grid>
            {form.repatriations.map((item, idx) => (
              <React.Fragment key={`repatriation-${idx}`}>
                <Grid item xs={4}><TextField label={t("date")} name="date" type="date" InputLabelProps={{ shrink: true }} fullWidth value={item.date} onChange={e => handleRepatriationsChange(idx, e)} /></Grid>
                <Grid item xs={4}><TextField label={t("conditions")} name="conditions" fullWidth value={item.conditions} onChange={e => handleRepatriationsChange(idx, e)} /></Grid>
                <Grid item xs={3}><TextField label={t("stateCharges")} name="stateCharges" fullWidth value={item.stateCharges} onChange={e => handleRepatriationsChange(idx, e)} /></Grid>
                <Grid item xs={1} alignSelf="center">
                  <IconButton color="error" onClick={() => removeRepatriation(idx)} disabled={form.repatriations.length === 1}><RemoveCircleIcon /></IconButton>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}><Button onClick={addRepatriation} startIcon={<AddCircleIcon />} variant="outlined">{t("add")}</Button></Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}><Typography variant="h6">{t("consularFileStepCivilActs")}</Typography></Grid>
            <Grid item xs={12}><TextField label={t("civilNotarialActs")} name="civilNotarialActs" fullWidth multiline minRows={3} value={form.civilNotarialActs} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField label={t("applicantSignature")} name="applicantSignature" fullWidth value={form.applicantSignature} onChange={handleChange} /></Grid>
            <Grid item xs={12}><Divider sx={{ my: 2 }} /></Grid>
            {/* File Attachment */}
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth sx={{ mt: 1, mb: 2 }}>
                {t("uploadAttachment")}
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {form.attachment && <Typography variant="body2" sx={{ mb: 1 }}>{form.attachment.name}</Typography>}
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  }

  return (
    <Box className="consularfile-wizard-container">
      <Paper elevation={4} sx={{ p: 4, maxWidth: 850, margin: "auto" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, i) => (
            <Step key={i}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Divider sx={{ my: 2 }} />
        <form onSubmit={handleSubmit}>
          <Box sx={{ pt: 2 }}>
            {getStepContent(activeStep)}
          </Box>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          {message && <Typography color="primary" sx={{ mt: 2 }}>{message}</Typography>}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button disabled={activeStep === 0} onClick={handleBack}>{t("back")}</Button>
            {activeStep < steps.length - 1 ? (
              <Button variant="contained" onClick={handleNext}>{t("next")}</Button>
            ) : (
              <Button type="submit" variant="contained" color="primary">{t("submit")}</Button>
            )}
          </Box>
        </form>
      </Paper>
    </Box>
  );
}