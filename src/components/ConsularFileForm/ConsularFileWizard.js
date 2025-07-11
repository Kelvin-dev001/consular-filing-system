import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert
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
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Clean state when wizard is reopened for a new record
  useEffect(() => {
    setForm(initialForm);
    setActiveStep(0);
    setError("");
    setSnack({ open: false, message: "", severity: "success" });
    setSubmitting(false);
    setShowConfirm(false);
    // eslint-disable-next-line
  }, []);

  const steps = [
    t("consularFileStepInfo", "Consular File Information"),
    t("consularFileStepPassports", "Passports Granted"),
    t("consularFileStepRepatriations", "Repatriations"),
    t("consularFileStepCivilActs", "Civil & Notary Acts")
  ];

  // FIELD HANDLERS
  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePassportsChange = (idx, e) => {
    setForm(f => ({
      ...f,
      passportsGranted: f.passportsGranted.map((item, i) =>
        i === idx ? { ...item, [e.target.name]: e.target.value } : item
      )
    }));
  };
  const addPassport = () =>
    setForm(f => ({
      ...f,
      passportsGranted: [
        ...f.passportsGranted,
        { number: "", issueDate: "", expiryDate: "", country: "" }
      ]
    }));
  const removePassport = (idx) =>
    setForm(f => ({
      ...f,
      passportsGranted: f.passportsGranted.filter((_, i) => i !== idx)
    }));

  const handleRepatriationsChange = (idx, e) => {
    setForm(f => ({
      ...f,
      repatriations: f.repatriations.map((item, i) =>
        i === idx ? { ...item, [e.target.name]: e.target.value } : item
      )
    }));
  };
  const addRepatriation = () =>
    setForm(f => ({
      ...f,
      repatriations: [
        ...f.repatriations,
        { date: "", conditions: "", stateCharges: "" }
      ]
    }));
  const removeRepatriation = (idx) =>
    setForm(f => ({
      ...f,
      repatriations: f.repatriations.filter((_, i) => i !== idx)
    }));

  const handleFileChange = (e) => setForm(f => ({ ...f, attachment: e.target.files[0] }));

  // STEP VALIDATION
  function validateStep(stepData, stepIdx) {
    switch (stepIdx) {
      case 0:
        if (!stepData.fileNumber || !stepData.openedOn || !stepData.name) {
          return t("pleaseFillAllRequiredFields", "Please fill all required fields");
        }
        break;
      case 1:
        if (
          !stepData.passportsGranted.length ||
          stepData.passportsGranted.some(
            p => !p.number || !p.country || !p.issueDate || !p.expiryDate
          )
        ) {
          return t("pleaseFillAllPassportFields", "Please fill all passport fields");
        }
        break;
      case 2:
        if (
          stepData.repatriations.some(
            r =>
              (r.date || r.conditions || r.stateCharges) &&
              (!r.date || !r.conditions)
          )
        ) {
          return t("pleaseFillAllRepatriationFields", "Please fill all repatriation fields");
        }
        break;
      case 3:
        break;
      default:
        break;
    }
    return "";
  }

  // NAVIGATION
  const handleNext = () => {
    setError("");
    const err = validateStep(form, activeStep);
    if (err) {
      setError(err);
      return;
    }
    setActiveStep((prev) => prev + 1);
  };
  const handleBack = () => {
    setError("");
    setActiveStep((prev) => prev - 1);
  };

  // SUBMISSION
  async function doSubmit() {
    setError("");
    setSnack({ open: false, message: "", severity: "success" });
    setSubmitting(true);
    try {
      let attachmentUrl = "";
      if (form.attachment) {
        const formData = new FormData();
        formData.append("file", form.attachment);
        const uploadRes = await API.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        attachmentUrl = uploadRes.data.filePath || uploadRes.data.url;
      }
      await API.post("/consular-files", {
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
      setSnack({
        open: true,
        message:
          t("consularFileForm", "Consular file") +
          " " +
          t("submit", "submitted").toLowerCase() +
          "!",
        severity: "success"
      });
      setForm(initialForm);
      setActiveStep(0);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setSnack({
        open: true,
        message: err?.response?.data?.message || t("submissionFailed", "Submission failed"),
        severity: "error"
      });
    } finally {
      setSubmitting(false);
      setShowConfirm(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    for (let s = 0; s < steps.length; s++) {
      const err = validateStep(form, s);
      if (err) {
        setError(err);
        setActiveStep(s);
        return;
      }
    }
    setShowConfirm(true);
  };

  // STEP CONTENT
  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}><Typography variant="h6">{steps[0]}</Typography></Grid>
            <Grid item xs={6}>
              <TextField label={t("fileNumber", "File Number")} name="fileNumber" fullWidth value={form.fileNumber} onChange={handleChange} required />
            </Grid>
            <Grid item xs={6}>
              <TextField label={t("openedOn", "Opened On")} name="openedOn" type="date" InputLabelProps={{ shrink: true }} fullWidth value={form.openedOn} onChange={handleChange} required />
            </Grid>
            <Grid item xs={6}>
              <TextField label={t("fullName", "Full Name")} name="name" fullWidth value={form.name} onChange={handleChange} required />
            </Grid>
            <Grid item xs={6}>
              <TextField label={t("spouse", "Spouse")} name="spouse" fullWidth value={form.spouse} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField label={t("observations", "Observations")} name="observations" fullWidth multiline minRows={2} value={form.observations} onChange={handleChange} />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}><Typography variant="h6">{steps[1]}</Typography></Grid>
            {form.passportsGranted.map((item, idx) => (
              <React.Fragment key={`passport-${idx}`}>
                <Grid item xs={3}>
                  <TextField label={t("number", "Number")} name="number" fullWidth value={item.number} onChange={e => handlePassportsChange(idx, e)} required />
                </Grid>
                <Grid item xs={3}>
                  <TextField label={t("issueDate", "Issue Date")} name="issueDate" type="date" InputLabelProps={{ shrink: true }} fullWidth value={item.issueDate} onChange={e => handlePassportsChange(idx, e)} required />
                </Grid>
                <Grid item xs={3}>
                  <TextField label={t("expiryDate", "Expiry Date")} name="expiryDate" type="date" InputLabelProps={{ shrink: true }} fullWidth value={item.expiryDate} onChange={e => handlePassportsChange(idx, e)} required />
                </Grid>
                <Grid item xs={2}>
                  <TextField label={t("country", "Country")} name="country" fullWidth value={item.country} onChange={e => handlePassportsChange(idx, e)} required />
                </Grid>
                <Grid item xs={1} alignSelf="center">
                  <IconButton color="error" onClick={() => removePassport(idx)} disabled={form.passportsGranted.length === 1 || submitting}>
                    <RemoveCircleIcon />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button onClick={addPassport} startIcon={<AddCircleIcon />} variant="outlined" disabled={submitting}>
                {t("add", "Add")}
              </Button>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}><Typography variant="h6">{steps[2]}</Typography></Grid>
            {form.repatriations.map((item, idx) => (
              <React.Fragment key={`repatriation-${idx}`}>
                <Grid item xs={4}>
                  <TextField label={t("date", "Date")} name="date" type="date" InputLabelProps={{ shrink: true }} fullWidth value={item.date} onChange={e => handleRepatriationsChange(idx, e)} />
                </Grid>
                <Grid item xs={4}>
                  <TextField label={t("conditions", "Conditions")} name="conditions" fullWidth value={item.conditions} onChange={e => handleRepatriationsChange(idx, e)} />
                </Grid>
                <Grid item xs={3}>
                  <TextField label={t("stateCharges", "State Charges")} name="stateCharges" fullWidth value={item.stateCharges} onChange={e => handleRepatriationsChange(idx, e)} />
                </Grid>
                <Grid item xs={1} alignSelf="center">
                  <IconButton color="error" onClick={() => removeRepatriation(idx)} disabled={form.repatriations.length === 1 || submitting}>
                    <RemoveCircleIcon />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button onClick={addRepatriation} startIcon={<AddCircleIcon />} variant="outlined" disabled={submitting}>
                {t("add", "Add")}
              </Button>
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}><Typography variant="h6">{steps[3]}</Typography></Grid>
            <Grid item xs={12}>
              <TextField label={t("civilNotarialActs", "Civil/Notarial Acts")} name="civilNotarialActs" fullWidth multiline minRows={3} value={form.civilNotarialActs} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField label={t("applicantSignature", "Applicant Signature")} name="applicantSignature" fullWidth value={form.applicantSignature} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}><Divider sx={{ my: 2 }} /></Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth sx={{ mt: 1, mb: 2 }}>
                {t("uploadAttachment", "Upload Attachment")}
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
        <form onSubmit={handleSubmit} autoComplete="off">
          <Box sx={{ pt: 2 }}>
            {getStepContent(activeStep)}
          </Box>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button disabled={activeStep === 0 || submitting} onClick={handleBack}>{t("back", "Back")}</Button>
            {activeStep < steps.length - 1 ? (
              <Button variant="contained" onClick={handleNext} disabled={submitting}>
                {t("next", "Next")}
              </Button>
            ) : (
              <Button type="submit" variant="contained" color="primary" disabled={submitting}>
                {submitting ? <CircularProgress size={24} /> : t("submit", "Submit")}
              </Button>
            )}
          </Box>
        </form>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onClose={() => setShowConfirm(false)}>
        <DialogTitle>{t("confirmSubmissionTitle", "Confirm Submission")}</DialogTitle>
        <DialogContent>
          <Typography>
            {t("confirmSubmissionText", "Are you sure you want to submit this consular file?.")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirm(false)} disabled={submitting}>
            {t("cancel", "Cancel")}
          </Button>
          <Button
            onClick={doSubmit}
            color="primary"
            variant="contained"
            disabled={submitting}
            autoFocus
          >
            {submitting ? <CircularProgress size={22} /> : t("confirm", "Confirm")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success/error */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} variant="filled">
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}