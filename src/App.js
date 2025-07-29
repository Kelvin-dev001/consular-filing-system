import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { setToken } from "./utils/auth";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";
import ConsularFileForm from "./components/ConsularFileForm/ConsularFileForm";
import RegistrationsTable from "./components/RegistrationForm/RegistrationsTable";
import ConsularFileTable from "./components/ConsularFileForm/ConsularFileTable";
import ConsularFileView from "./components/ConsularFileForm/ConsularFileView"; // NEW

// Helper component to handle Google Login Redirect
function GoogleRedirectHandler({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      setToken(token);
      navigate("/dashboard", { replace: true });
    }
    // eslint-disable-next-line
  }, [location.search, navigate]);

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <GoogleRedirectHandler>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/registration-form" element={<RegistrationForm />} />
          <Route path="/consular-file-form" element={<ConsularFileForm />} />
          <Route path="/registrations" element={<RegistrationsTable />} />
          <Route path="/consular-files" element={<ConsularFileTable />} />
          <Route path="/consular-file/:id" element={<ConsularFileView />} /> {/* NEW */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </GoogleRedirectHandler>
    </BrowserRouter>
  );
}

export default App;