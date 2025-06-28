import { jwtDecode } from "jwt-decode";

// Save the JWT token to localStorage
export function setToken(token) {
  localStorage.setItem("token", token);
}

// Retrieve the JWT token from localStorage
export function getToken() {
  return localStorage.getItem("token");
}

// Decode the JWT token to get user info, or return null if token is missing/invalid
export function getUser() {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

// Remove the JWT token from localStorage (log out)
export function logout() {
  localStorage.removeItem("token");
}