import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  TextField,
  Divider,
  CircularProgress,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  Tooltip,
  Avatar,
  Chip,
  Fade,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { getUser, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import TableChartIcon from "@mui/icons-material/TableChart";
import EditRegistrationDialog from "../components/RegistrationForm/EditRegistrationDialog";
import { useTranslation } from "react-i18next";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Dashboard() {
  const user = getUser();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Registration states
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regPage, setRegPage] = useState(1);
  const [regTotalPages, setRegTotalPages] = useState(1);
  const [regSearch, setRegSearch] = useState("");
  const [regDateFrom, setRegDateFrom] = useState("");
  const [regDateTo, setRegDateTo] = useState("");
  const [editReg, setEditReg] = useState(null);
  const REG_LIMIT = 5;

  // Consular file states
  const [consularFiles, setConsularFiles] = useState([]);
  const [consLoading, setConsLoading] = useState(true);
  const [consPage, setConsPage] = useState(1);
  const [consTotalPages, setConsTotalPages] = useState(1);
  const [consSearch, setConsSearch] = useState("");
  const [consDateFrom, setConsDateFrom] = useState("");
  const [consDateTo, setConsDateTo] = useState("");
  const CONS_LIMIT = 5;

  // Fetch registrations (paginated/filter/search)
  const fetchRegistrations = () => {
    setLoading(true);
    API.get("/registrations", {
      params: {
        page: regPage,
        limit: REG_LIMIT,
        search: regSearch,
        dateFrom: regDateFrom,
        dateTo: regDateTo,
      },
    })
      .then((res) => {
        setRegistrations(res.data.records || res.data);
        setRegTotalPages(res.data.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Fetch consular files (paginated/filter/search)
  const fetchConsularFiles = () => {
    setConsLoading(true);
    API.get("/consular-files", {
      params: {
        page: consPage,
        limit: CONS_LIMIT,
        search: consSearch,
        dateFrom: consDateFrom,
        dateTo: consDateTo,
      },
    })
      .then((res) => {
        setConsularFiles(res.data.records || res.data);
        setConsTotalPages(res.data.totalPages || 1);
        setConsLoading(false);
      })
      .catch(() => setConsLoading(false));
  };

  useEffect(() => {
    fetchRegistrations();
    // eslint-disable-next-line
  }, [regPage, regSearch, regDateFrom, regDateTo]);

  useEffect(() => {
    fetchConsularFiles();
    // eslint-disable-next-line
  }, [consPage, consSearch, consDateFrom, consDateTo]);

  // Avatar color generator for a unique user chip
  const stringToColor = (string) => {
    let hash = 0,
      i;
    for (i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  };

  // Registration delete handler
  const handleDeleteReg = async (id) => {
    if (!window.confirm(t("deleteRegistrationConfirm") || t("deleteConfirm", { type: t("registration") }))) return;
    await API.delete(`/registration/${id}`);
    fetchRegistrations();
  };

  return (
    <Box
      minHeight="100vh"
      sx={{
        background: "linear-gradient(120deg, #f8fafc 0%, #ffe0ef 100%)",
        py: isMobile ? 1 : 4,
        px: isMobile ? 0.5 : 4,
      }}
    >
      {/* Language switcher */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Select
          size="small"
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          sx={{ minWidth: 130, background: "#fff", borderRadius: 2 }}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="pt">Português</MenuItem>
        </Select>
      </Box>

      <Fade in>
        <Paper
          elevation={4}
          sx={{
            p: isMobile ? 2 : 4,
            mb: 3,
            borderRadius: 4,
            maxWidth: 800,
            mx: "auto",
            boxShadow:
              "0 6px 32px 0 rgba(35, 0, 40, 0.08), 0 1.5px 5px 0 rgba(177, 0, 86, 0.08)",
            background: "#fff9fc",
          }}
        >
          <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems={isMobile ? "flex-start" : "center"}>
            <Avatar
              sx={{
                bgcolor: stringToColor(user?.name || "U"),
                width: 56,
                height: 56,
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              {(user?.name || "U")[0]}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h5" fontWeight={600} letterSpacing={0.5}>
                {t("welcome", { name: user?.name || "User" })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("email")}: {user?.email}
              </Typography>
            </Box>
            <Stack direction="row" spacing={2} mt={isMobile ? 2 : 0}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/registration-form")}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                {t("registrationForm")}
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/consular-file-form")}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  background: "linear-gradient(90deg, #b10056 0%, #f83392 100%)",
                }}
              >
                {t("consularFileForm")}
              </Button>
              <Button
                variant="outlined"
                startIcon={<TableChartIcon />}
                onClick={() => navigate("/registrations")}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                {t("Registrations")}
              </Button>
              <Button
                variant="outlined"
                startIcon={<TableChartIcon />}
                onClick={() => navigate("/consular-files")}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {t("consularFiles")}
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                {t("logout")}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Fade>

      {/* REGISTRATION RECORDS */}
      <Fade in timeout={600}>
        <Paper
          elevation={2}
          sx={{
            p: isMobile ? 1.5 : 3,
            mb: 4,
            borderRadius: 3,
            maxWidth: 800,
            mx: "auto",
          }}
        >
          <Typography
            variant="h6"
            mb={2}
            color="#b10056"
            fontWeight={700}
            letterSpacing={0.5}
          >
            {t("registrationRecords")}
          </Typography>
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <TextField
              size="small"
              placeholder={t("searchByNamePassport")}
              value={regSearch}
              onChange={(e) => {
                setRegSearch(e.target.value);
                setRegPage(1);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: isMobile ? "100%" : 200 }}
            />
            <TextField
              size="small"
              label={t("from")}
              type="date"
              value={regDateFrom}
              onChange={(e) => {
                setRegDateFrom(e.target.value);
                setRegPage(1);
              }}
              InputLabelProps={{ shrink: true }}
              sx={{ width: isMobile ? "100%" : 150 }}
            />
            <TextField
              size="small"
              label={t("to")}
              type="date"
              value={regDateTo}
              onChange={(e) => {
                setRegDateTo(e.target.value);
                setRegPage(1);
              }}
              InputLabelProps={{ shrink: true }}
              sx={{ width: isMobile ? "100%" : 150 }}
            />
            <Button
              onClick={() => {
                setRegSearch("");
                setRegDateFrom("");
                setRegDateTo("");
                setRegPage(1);
              }}
              sx={{ textTransform: "none" }}
            >
              {t("clear")}
            </Button>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          {loading ? (
            <Box textAlign="center" py={3}>
              <CircularProgress />
            </Box>
          ) : registrations.length === 0 ? (
            <Typography
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 2 }}
            >
              {t("noRegistrations")}
            </Typography>
          ) : (
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              {registrations.map((reg, idx) => (
                <Paper
                  key={reg._id || idx}
                  elevation={0}
                  sx={{
                    mb: 2,
                    py: 1.5,
                    px: 2,
                    borderRadius: 2,
                    background: "#fff3f8",
                    display: "flex",
                    flexDirection: isMobile
                      ? "column"
                      : "row",
                    alignItems: isMobile
                      ? "flex-start"
                      : "center",
                    gap: 1.5,
                  }}
                  component="li"
                >
                  <Box flex={1}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                    >
                      <Chip
                        label={reg.fileNumber || "-"}
                        sx={{
                          bgcolor: "#f6d6e8",
                          color: "#b10056",
                          fontWeight: 600,
                          fontSize: "0.95em",
                        }}
                      />
                      <Typography
                        fontWeight={600}
                        sx={{ ml: 1 }}
                      >
                        {reg.fullName || "-"}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        fontSize="0.97em"
                        sx={{ ml: 2 }}
                      >
                        {t("passport")}: {reg.passportOrIdNumber || "-"}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mt={0.5}
                    >
                      {t("dob")}: {reg.birthDate || "-"}
                    </Typography>
                    {reg.passportPhoto && (
                      <Avatar
                        src={reg.passportPhoto}
                        alt={t("photo")}
                        variant="rounded"
                        sx={{
                          mt: 1,
                          width: 46,
                          height: 46,
                          border: "2px solid #f83392",
                        }}
                      />
                    )}
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title={t("edit")}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => setEditReg(reg)}
                        aria-label={t("editRegistration")}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("delete")}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteReg(reg._id)}
                        aria-label={t("deleteRegistration")}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Paper>
              ))}
            </Box>
          )}
          {/* Pagination for registrations */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 2 }}
            justifyContent="center"
            alignItems="center"
          >
            <IconButton
              disabled={regPage === 1}
              onClick={() => setRegPage(regPage - 1)}
              aria-label={t("previousPage")}
            >
              <TableChartIcon />
            </IconButton>
            <Typography>
              {t("page")} {regPage} {t("of")} {regTotalPages}
            </Typography>
            <IconButton
              disabled={regPage === regTotalPages}
              onClick={() => setRegPage(regPage + 1)}
              aria-label={t("nextPage")}
            >
              <TableChartIcon />
            </IconButton>
          </Stack>
        </Paper>
      </Fade>
      <EditRegistrationDialog
        open={!!editReg}
        onClose={() => setEditReg(null)}
        registration={editReg}
        onSave={fetchRegistrations}
      />

      {/* CONSULAR FILES - search/filter, paginated */}
      <Fade in timeout={900}>
        <Paper
          elevation={2}
          sx={{
            p: isMobile ? 1.5 : 3,
            mb: 4,
            borderRadius: 3,
            maxWidth: 800,
            mx: "auto",
          }}
        >
          <Typography
            variant="h6"
            mb={2}
            color="#b10056"
            fontWeight={700}
            letterSpacing={0.5}
          >
            {t("consularFileRecords")}
          </Typography>
          {/* Search/filter for consular files */}
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <TextField
              size="small"
              placeholder={t("searchBySubjectDescription")}
              value={consSearch}
              onChange={(e) => {
                setConsSearch(e.target.value);
                setConsPage(1);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: isMobile ? "100%" : 200 }}
            />
            <TextField
              size="small"
              label={t("from")}
              type="date"
              value={consDateFrom}
              onChange={(e) => {
                setConsDateFrom(e.target.value);
                setConsPage(1);
              }}
              InputLabelProps={{ shrink: true }}
              sx={{ width: isMobile ? "100%" : 150 }}
            />
            <TextField
              size="small"
              label={t("to")}
              type="date"
              value={consDateTo}
              onChange={(e) => {
                setConsDateTo(e.target.value);
                setConsPage(1);
              }}
              InputLabelProps={{ shrink: true }}
              sx={{ width: isMobile ? "100%" : 150 }}
            />
            <Button
              onClick={() => {
                setConsSearch("");
                setConsDateFrom("");
                setConsDateTo("");
                setConsPage(1);
              }}
              sx={{ textTransform: "none" }}
            >
              {t("clear")}
            </Button>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          {consLoading ? (
            <Box textAlign="center" py={3}>
              <CircularProgress />
            </Box>
          ) : consularFiles.length === 0 ? (
            <Typography color="text.secondary" textAlign="center">
              {t("noConsularFiles")}
            </Typography>
          ) : (
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              {consularFiles.map((file, idx) => (
                <Paper
                  key={file._id || idx}
                  elevation={0}
                  sx={{
                    mb: 2,
                    py: 1.5,
                    px: 2,
                    borderRadius: 2,
                    background: "#f9f3fa",
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center",
                    gap: 1.5,
                  }}
                  component="li"
                >
                  <Box flex={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Chip
                        label={file.fileNumber || "-"}
                        sx={{
                          bgcolor: "#f6d6e8",
                          color: "#b10056",
                          fontWeight: 600,
                          fontSize: "0.95em",
                        }}
                      />
                      <Typography fontWeight={600} sx={{ ml: 1 }}>
                        {file.name || file.subject || "-"}
                      </Typography>
                      {file.openedOn && (
                        <Typography
                          color="text.secondary"
                          fontSize="0.97em"
                          sx={{ ml: 2 }}
                        >
                          {t("openedOn")}: {file.openedOn}
                        </Typography>
                      )}
                    </Stack>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      {file.observations || file.description || ""}
                    </Typography>
                    {file.attachment && (
                      <a
                        href={file.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          marginTop: 8,
                          display: "inline-block",
                          color: "#b10056",
                          fontWeight: 600,
                          textDecoration: "underline",
                        }}
                      >
                        {t("viewAttachment")}
                      </a>
                    )}
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
          {/* Pagination for consular files */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 2 }}
            justifyContent="center"
            alignItems="center"
          >
            <IconButton
              disabled={consPage === 1}
              onClick={() => setConsPage(consPage - 1)}
              aria-label={t("previousPage")}
            >
              <TableChartIcon />
            </IconButton>
            <Typography>
              {t("page")} {consPage} {t("of")} {consTotalPages}
            </Typography>
            <IconButton
              disabled={consPage === consTotalPages}
              onClick={() => setConsPage(consPage + 1)}
              aria-label={t("nextPage")}
            >
              <TableChartIcon />
            </IconButton>
          </Stack>
        </Paper>
      </Fade>
    </Box>
  );
}