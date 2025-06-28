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
} from "@mui/material";
import API from "../../utils/api";

export default function EditRegistrationDialog({ open, onClose, registration, onSave }) {
  const [form, setForm] = useState(registration || {});
  const [file, setFile] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setForm(registration || {});
    setFile(null);
  }, [registration]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async () => {
    try {
      let newPhotoUrl = form.photo;

      // If a new file was selected, upload it first
      if (file) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await API.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        newPhotoUrl = uploadRes.data.filePath || uploadRes.data.url;
        setUploading(false);
      }

      await API.put(`/registration/${form._id}`, {
        ...form,
        photo: newPhotoUrl,
      });
      setSnack({ open: true, message: "Registration updated successfully!", severity: "success" });
      onSave();
      onClose();
    } catch (err) {
      setUploading(false);
      setSnack({ open: true, message: "Update failed", severity: "error" });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Edit Registration</DialogTitle>
        <DialogContent>
          <TextField
            label="Full Name"
            name="fullname"
            fullWidth
            margin="normal"
            value={form.fullname || ""}
            onChange={handleChange}
          />
          <TextField
            label="Date of Birth"
            name="dob"
            type="date"
            fullWidth
            margin="normal"
            value={form.dob || ""}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Passport Number"
            name="passport"
            fullWidth
            margin="normal"
            value={form.passport || ""}
            onChange={handleChange}
          />
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Current Photo:
          </Typography>
          {form.photo ? (
            <Typography variant="body2" sx={{ mb: 1 }}>
              <a href={form.photo} target="_blank" rel="noopener noreferrer">
                {form.photo}
              </a>
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ mb: 1 }}>No photo</Typography>
          )}
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mb: 1 }}
            disabled={uploading}
          >
            {file ? "Change Photo" : "Upload New Photo"}
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
          {file && <Typography variant="body2">Selected: {file.name}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={uploading}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </>
  );
}