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
  Grid,
  IconButton,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import API from "../../utils/api";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export default function EditRegistrationDialog({ open, onClose, registration, onSave }) {
  // Controlled form state with sensible defaults
  const [form, setForm] = useState({
    fullName: "",
    fileNumber: "",
    countryPlaceOfBirth: "",
    birthDate: "",
    maritalStatus: "",
    profession: "",
    education: "",
    workplaceOrSchool: "",
    phone: "",
    cellPhone: "",
    currentResidence: "",
    residenceKenya: "",
    residenceMozambique: "",
    district: "",
    fatherName: "",
    motherName: "",
    passportOrIdNumber: "",
    passportIssuedAt: "",
    passportValidUntil: "",
    documentsPresented: "",
    issuedOn: "",
    observations: "",
    passportPhoto: "",
    spouse: {},
    familyMozambique: [],
    familyUnder15: [],
    ...registration
  });
  const [file, setFile] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (registration) {
      setForm({
        fullName: "",
        fileNumber: "",
        countryPlaceOfBirth: "",
        birthDate: "",
        maritalStatus: "",
        profession: "",
        education: "",
        workplaceOrSchool: "",
        phone: "",
        cellPhone: "",
        currentResidence: "",
        residenceKenya: "",
        residenceMozambique: "",
        district: "",
        fatherName: "",
        motherName: "",
        passportOrIdNumber: "",
        passportIssuedAt: "",
        passportValidUntil: "",
        documentsPresented: "",
        issuedOn: "",
        observations: "",
        passportPhoto: "",
        spouse: {},
        familyMozambique: [],
        familyUnder15: [],
        ...registration
      });
    }
    setFile(null);
  }, [registration]);

  // Handle primitive value changes
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Handle spouse field changes
  const handleSpouseChange = (e) => setForm({
    ...form,
    spouse: {
      ...form.spouse,
      [e.target.name]: e.target.value,
    },
  });

  // Handle familyMozambique/familyUnder15 array changes
  const handleFamilyChange = (key, idx, e) => {
    const updated = form[key] ? [...form[key]] : [];
    updated[idx] = { ...updated[idx], [e.target.name]: e.target.value };
    setForm({ ...form, [key]: updated });
  };

  // Add/remove for family arrays
  const addFamilyMember = (key, emptyObj) =>
    setForm({ ...form, [key]: [...(form[key] || []), emptyObj] });

  const removeFamilyMember = (key, idx) => {
    const updated = [...(form[key] || [])];
    updated.splice(idx, 1);
    setForm({ ...form, [key]: updated });
  };

  // File/photo handling
  const handleFileChange = (e) => setFile(e.target.files[0]);

  // Submit handler
  const handleSubmit = async () => {
    setUploading(true);
    setSnack({ open: false, message: "", severity: "success" });
    try {
      let newPhotoUrl = form.passportPhoto;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await API.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        newPhotoUrl = uploadRes.data.filePath || uploadRes.data.url;
      }

      await API.put(`/registration/${form._id}`, {
        ...form,
        passportPhoto: newPhotoUrl,
      });
      setSnack({ open: true, message: "Registration updated successfully!", severity: "success" });
      setUploading(false);
      if (onSave) onSave();
      if (onClose) onClose();
    } catch (err) {
      setUploading(false);
      setSnack({ open: true, message: err?.response?.data?.message || "Update failed", severity: "error" });
    }
  };

  const handleCloseSnack = () => setSnack({ ...snack, open: false });

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Registration</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Left column */}
            <Grid item xs={12} sm={6}>
              <TextField label="Full Name" name="fullName" fullWidth margin="normal" required value={form.fullName || ""} onChange={handleChange} />
              <TextField label="File Number" name="fileNumber" fullWidth margin="normal" required value={form.fileNumber || ""} onChange={handleChange} />
              <TextField label="Country/Place of Birth" name="countryPlaceOfBirth" fullWidth margin="normal" value={form.countryPlaceOfBirth || ""} onChange={handleChange} />
              <TextField label="Date of Birth" name="birthDate" type="date" fullWidth margin="normal" value={form.birthDate ? form.birthDate.substring(0,10) : ""} onChange={handleChange} InputLabelProps={{ shrink: true }} />
              <TextField label="Marital Status" name="maritalStatus" fullWidth margin="normal" value={form.maritalStatus || ""} onChange={handleChange} />
              <TextField label="Profession" name="profession" fullWidth margin="normal" value={form.profession || ""} onChange={handleChange} />
              <TextField label="Education" name="education" fullWidth margin="normal" value={form.education || ""} onChange={handleChange} />
              <TextField label="Workplace/School" name="workplaceOrSchool" fullWidth margin="normal" value={form.workplaceOrSchool || ""} onChange={handleChange} />
              <TextField label="Phone" name="phone" fullWidth margin="normal" value={form.phone || ""} onChange={handleChange} />
              <TextField label="Cell Phone" name="cellPhone" fullWidth margin="normal" value={form.cellPhone || ""} onChange={handleChange} />
              <TextField label="Current Residence" name="currentResidence" fullWidth margin="normal" value={form.currentResidence || ""} onChange={handleChange} />
              <TextField label="Residence Kenya" name="residenceKenya" fullWidth margin="normal" value={form.residenceKenya || ""} onChange={handleChange} />
              <TextField label="Residence Mozambique" name="residenceMozambique" fullWidth margin="normal" value={form.residenceMozambique || ""} onChange={handleChange} />
              <TextField label="District" name="district" fullWidth margin="normal" value={form.district || ""} onChange={handleChange} />
            </Grid>
            {/* Right column */}
            <Grid item xs={12} sm={6}>
              <TextField label="Father Name" name="fatherName" fullWidth margin="normal" value={form.fatherName || ""} onChange={handleChange} />
              <TextField label="Mother Name" name="motherName" fullWidth margin="normal" value={form.motherName || ""} onChange={handleChange} />
              <TextField label="Passport/ID Number" name="passportOrIdNumber" fullWidth margin="normal" value={form.passportOrIdNumber || ""} onChange={handleChange} />
              <TextField label="Passport Issued At" name="passportIssuedAt" fullWidth margin="normal" value={form.passportIssuedAt || ""} onChange={handleChange} />
              <TextField label="Passport Valid Until" name="passportValidUntil" type="date" fullWidth margin="normal" value={form.passportValidUntil ? form.passportValidUntil.substring(0,10) : ""} onChange={handleChange} InputLabelProps={{ shrink: true }} />
              <TextField label="Documents Presented" name="documentsPresented" fullWidth margin="normal" value={form.documentsPresented || ""} onChange={handleChange} />
              <TextField label="Issued On" name="issuedOn" type="date" fullWidth margin="normal" value={form.issuedOn ? form.issuedOn.substring(0,10) : ""} onChange={handleChange} InputLabelProps={{ shrink: true }} />
              <TextField label="Observations" name="observations" fullWidth multiline rows={2} margin="normal" value={form.observations || ""} onChange={handleChange} />
              {/* Passport Photo */}
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                Current Passport Photo:
              </Typography>
              {form.passportPhoto ? (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <a href={form.passportPhoto} target="_blank" rel="noopener noreferrer">
                    {form.passportPhoto}
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
            </Grid>
          </Grid>
          {/* Spouse */}
          <Divider sx={{ my: 2 }}>Spouse</Divider>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Spouse Full Name"
                name="fullName"
                fullWidth
                margin="normal"
                value={form.spouse?.fullName || ""}
                onChange={handleSpouseChange}
              />
              <TextField
                label="Spouse Nationality"
                name="nationality"
                fullWidth
                margin="normal"
                value={form.spouse?.nationality || ""}
                onChange={handleSpouseChange}
              />
              <TextField
                label="Spouse ID Document"
                name="idDocument"
                fullWidth
                margin="normal"
                value={form.spouse?.idDocument || ""}
                onChange={handleSpouseChange}
              />
              <TextField
                label="Spouse Profession"
                name="profession"
                fullWidth
                margin="normal"
                value={form.spouse?.profession || ""}
                onChange={handleSpouseChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Spouse Workplace"
                name="workplace"
                fullWidth
                margin="normal"
                value={form.spouse?.workplace || ""}
                onChange={handleSpouseChange}
              />
              <TextField
                label="Spouse Cell Phone"
                name="cellPhone"
                fullWidth
                margin="normal"
                value={form.spouse?.cellPhone || ""}
                onChange={handleSpouseChange}
              />
            </Grid>
          </Grid>
          {/* Family Mozambique */}
          <Divider sx={{ my: 2 }}>Family in Mozambique</Divider>
          {(form.familyMozambique || []).map((member, idx) => (
            <Box key={idx} sx={{ mb: 2, p: 1, border: "1px solid #eee", borderRadius: 1, position: "relative" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Name"
                    name="name"
                    fullWidth
                    margin="dense"
                    value={member.name || ""}
                    onChange={e => handleFamilyChange("familyMozambique", idx, e)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Relationship"
                    name="relationship"
                    fullWidth
                    margin="dense"
                    value={member.relationship || ""}
                    onChange={e => handleFamilyChange("familyMozambique", idx, e)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Residence"
                    name="residence"
                    fullWidth
                    margin="dense"
                    value={member.residence || ""}
                    onChange={e => handleFamilyChange("familyMozambique", idx, e)}
                  />
                </Grid>
              </Grid>
              <IconButton size="small" sx={{ position: "absolute", top: 4, right: 4 }} color="error"
                onClick={() => removeFamilyMember("familyMozambique", idx)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() => addFamilyMember("familyMozambique", { name: "", relationship: "", residence: "" })}
            sx={{ mb: 2 }}
          >
            Add Family Member (Mozambique)
          </Button>
          {/* Family Under 15 */}
          <Divider sx={{ my: 2 }}>Family Under 15</Divider>
          {(form.familyUnder15 || []).map((member, idx) => (
            <Box key={idx} sx={{ mb: 2, p: 1, border: "1px solid #eee", borderRadius: 1, position: "relative" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Name"
                    name="name"
                    fullWidth
                    margin="dense"
                    value={member.name || ""}
                    onChange={e => handleFamilyChange("familyUnder15", idx, e)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Relationship"
                    name="relationship"
                    fullWidth
                    margin="dense"
                    value={member.relationship || ""}
                    onChange={e => handleFamilyChange("familyUnder15", idx, e)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Age"
                    name="age"
                    type="number"
                    fullWidth
                    margin="dense"
                    value={member.age || ""}
                    onChange={e => handleFamilyChange("familyUnder15", idx, e)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Age Type</InputLabel>
                    <Select
                      name="ageType"
                      value={member.ageType || "years"}
                      label="Age Type"
                      onChange={e => handleFamilyChange("familyUnder15", idx, e)}
                    >
                      <MenuItem value="years">Years</MenuItem>
                      <MenuItem value="months">Months</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <IconButton size="small" sx={{ position: "absolute", top: 4, right: 4 }} color="error"
                onClick={() => removeFamilyMember("familyUnder15", idx)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() => addFamilyMember("familyUnder15", { name: "", relationship: "", age: "", ageType: "years" })}
            sx={{ mb: 2 }}
          >
            Add Family Member (Under 15)
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={uploading}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={uploading}
          >
            {uploading ? "Saving..." : "Save"}
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