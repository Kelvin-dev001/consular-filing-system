import React, { useState } from "react";
import {
  Stepper, Step, StepLabel, Box, Button, Typography, Grid, Paper,
  TextField, IconButton, Divider, Tooltip, CircularProgress
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

// ... initialForm and steps as in your code ...

export default function RegistrationWizard() {
  const [form, setForm] = useState(initialForm);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedRegistration, setSavedRegistration] = useState(null);
  const { t } = useTranslation();

  // ... all your field handlers (handleChange, add/remove, etc) ...

  const handleFileChange = (e) =>
    setForm({ ...form, passportPhoto: e.target.files[0] });

  // -------- Navigation --------
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // -------- Submission --------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
      const dataToSend = { ...form, passportPhoto: photoUrl };
      // Save registration and get the server version (with ID, timestamps, etc)
      const response = await API.post("/registrations", dataToSend);
      setSavedRegistration(response.data);
      setSubmitted(true);
      setForm(initialForm); // reset for a new registration if needed
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  // ... getStepContent as in your code (unchanged) ...

  // -------- Render --------
  if (submitted && savedRegistration) {
    return <ConfirmationPage form={savedRegistration} />;
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
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
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
                {loading ? "Submitting..." : t("submit") || "Submit"}
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Box>
  );
}