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

export default function EditConsularFileDialog({ open, onClose, consularFile, onSave }) {
  const [form, setForm] = useState(consularFile || {});
  const [file, setFile] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setForm(consularFile || {});
    setFile(null);
  }, [consularFile]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async () => {
    try {
      let newAttachmentUrl = form.attachment;

      // If a new file was selected, upload it first
      if (file) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await API.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        newAttachmentUrl = uploadRes.data.filePath || uploadRes.data.url;
        setUploading(false);
      }

      await API.put(`/consular-files/${form._id}`, {
        ...form,
        attachment: newAttachmentUrl,
      });
      setSnack({ open: true, message: "Consular file updated successfully!", severity: "success" });
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
        <DialogTitle>Edit Consular File</DialogTitle>
        <DialogContent>
          <TextField
            label="Subject"
            name="subject"
            fullWidth
            margin="normal"
            value={form.subject || ""}
            onChange={handleChange}
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={form.description || ""}
            onChange={handleChange}
          />
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Current Attachment:
          </Typography>
          {form.attachment ? (
            <Typography variant="body2" sx={{ mb: 1 }}>
              <a href={form.attachment} target="_blank" rel="noopener noreferrer">
                {form.attachment}
              </a>
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ mb: 1 }}>No attachment</Typography>
          )}
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mb: 1 }}
            disabled={uploading}
          >
            {file ? "Change Attachment" : "Upload New Attachment"}
            <input type="file" hidden onChange={handleFileChange} />
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