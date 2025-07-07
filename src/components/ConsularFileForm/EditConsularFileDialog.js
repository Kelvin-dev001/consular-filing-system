import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
  Typography,
  IconButton,
  Grid,
  Box,
} from "@mui/material";
import API from "../../utils/api";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export default function EditConsularFileDialog({ open, onClose, consularFile, onSave }) {
  const [form, setForm] = useState({
    fileNumber: "",
    name: "",
    openedOn: "",
    spouse: "",
    observations: "",
    passportsGranted: [],
    repatriations: [],
    civilNotarialActs: "",
    applicantSignature: "",
    ...consularFile,
  });
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (consularFile) {
      setForm({
        fileNumber: "",
        name: "",
        openedOn: "",
        spouse: "",
        observations: "",
        passportsGranted: [],
        repatriations: [],
        civilNotarialActs: "",
        applicantSignature: "",
        ...consularFile,
      });
    }
  }, [consularFile]);

  // Input handlers
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleDateChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value ? new Date(e.target.value) : "" });

  // Passports Granted Array
  const handlePassportChange = (idx, field, value) => {
    const updated = [...(form.passportsGranted || [])];
    updated[idx][field] = field.includes("Date") && value ? new Date(value) : value;
    setForm({ ...form, passportsGranted: updated });
  };
  const addPassport = () => {
    setForm({
      ...form,
      passportsGranted: [
        ...(form.passportsGranted || []),
        { number: "", issueDate: "", expiryDate: "", country: "" },
      ],
    });
  };
  const removePassport = (idx) => {
    const updated = [...(form.passportsGranted || [])];
    updated.splice(idx, 1);
    setForm({ ...form, passportsGranted: updated });
  };

  // Repatriations Array
  const handleRepatriationChange = (idx, field, value) => {
    const updated = [...(form.repatriations || [])];
    updated[idx][field] = field === "date" && value ? new Date(value) : value;
    setForm({ ...form, repatriations: updated });
  };
  const addRepatriation = () => {
    setForm({
      ...form,
      repatriations: [
        ...(form.repatriations || []),
        { date: "", conditions: "", stateCharges: "" },
      ],
    });
  };
  const removeRepatriation = (idx) => {
    const updated = [...(form.repatriations || [])];
    updated.splice(idx, 1);
    setForm({ ...form, repatriations: updated });
  };

  // Save handler
  const handleSubmit = async () => {
    setLoading(true);
    setSnack({ open: false, message: "", severity: "success" });
    try {
      await API.put(`/consular-files/${form._id}`, form);
      setSnack({ open: true, message: "Saving successful!", severity: "success" });
      setLoading(false);
      if (onSave) onSave();
      if (onClose) onClose();
    } catch (err) {
      setLoading(false);
      setSnack({
        open: true,
        message: err?.response?.data?.message || "Saving failed!",
        severity: "error",
      });
    }
  };

  const handleCloseSnack = () => setSnack({ ...snack, open: false });

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Edit Consular File</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="File Number"
                name="fileNumber"
                fullWidth
                value={form.fileNumber || ""}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                value={form.name || ""}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Opened On"
                name="openedOn"
                type="date"
                fullWidth
                value={form.openedOn ? new Date(form.openedOn).toISOString().substring(0, 10) : ""}
                onChange={e =>
                  setForm({ ...form, openedOn: e.target.value ? new Date(e.target.value) : "" })
                }
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Spouse"
                name="spouse"
                fullWidth
                value={form.spouse || ""}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Observations"
                name="observations"
                fullWidth
                multiline
                rows={2}
                value={form.observations || ""}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
          </Grid>

          {/* Passports Granted */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Passports Granted
              <IconButton onClick={addPassport} size="small" sx={{ ml: 1 }}>
                <AddIcon />
              </IconButton>
            </Typography>
            {(form.passportsGranted || []).map((p, idx) => (
              <Grid container spacing={1} alignItems="center" key={idx} sx={{ mb: 1 }}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Number"
                    fullWidth
                    value={p.number || ""}
                    onChange={e => handlePassportChange(idx, "number", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Issue Date"
                    type="date"
                    fullWidth
                    value={p.issueDate ? new Date(p.issueDate).toISOString().substring(0, 10) : ""}
                    onChange={e => handlePassportChange(idx, "issueDate", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Expiry Date"
                    type="date"
                    fullWidth
                    value={p.expiryDate ? new Date(p.expiryDate).toISOString().substring(0, 10) : ""}
                    onChange={e => handlePassportChange(idx, "expiryDate", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    label="Country"
                    fullWidth
                    value={p.country || ""}
                    onChange={e => handlePassportChange(idx, "country", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <IconButton onClick={() => removePassport(idx)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Box>

          {/* Repatriations */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Repatriations
              <IconButton onClick={addRepatriation} size="small" sx={{ ml: 1 }}>
                <AddIcon />
              </IconButton>
            </Typography>
            {(form.repatriations || []).map((r, idx) => (
              <Grid container spacing={1} alignItems="center" key={idx} sx={{ mb: 1 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Date"
                    type="date"
                    fullWidth
                    value={r.date ? new Date(r.date).toISOString().substring(0, 10) : ""}
                    onChange={e => handleRepatriationChange(idx, "date", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Conditions"
                    fullWidth
                    value={r.conditions || ""}
                    onChange={e => handleRepatriationChange(idx, "conditions", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="State Charges"
                    fullWidth
                    value={r.stateCharges || ""}
                    onChange={e => handleRepatriationChange(idx, "stateCharges", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <IconButton onClick={() => removeRepatriation(idx)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Box>

          <Box sx={{ mt: 3 }}>
            <TextField
              label="Civil Notarial Acts"
              name="civilNotarialActs"
              fullWidth
              value={form.civilNotarialActs || ""}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              label="Applicant Signature"
              name="applicantSignature"
              fullWidth
              value={form.applicantSignature || ""}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnack} severity={snack.severity} variant="filled">
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}