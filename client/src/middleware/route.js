import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

export const Protected = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to={"/"} replace={true} />;
  }
  return children;
};

export const Public = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return children;
  }
  return <Navigate to={"/"} replace={true} />;
};

export const Admin = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to={"/"} replace={true} />;
  try {
    const user = jwtDecode(token);
    if (user.role === "Admin") return children;
  } catch (e) {
    console.error("Token decoding error:", e);
  }
  return <Navigate to={"/"} replace={true} />;
};

export const DoctorOnly = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to={"/"} replace={true} />;
  try {
    const user = jwtDecode(token);
    if (user.role === "Doctor") return children;
  } catch (e) {
    console.error("Token decoding error:", e);
  }
  return <Navigate to={"/"} replace={true} />;
};

export const PatientOnly = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to={"/"} replace={true} />;
  try {
    const user = jwtDecode(token);
    if (user.role === "Patient") return children;
  } catch (e) {
    console.error("Token decoding error:", e);
  }
  return <Navigate to={"/"} replace={true} />;
};

import PropTypes from 'prop-types';

Protected.propTypes = {
  children: PropTypes.any
};

Public.propTypes = {
  children: PropTypes.any
};

Admin.propTypes = {
  children: PropTypes.any
};

DoctorOnly.propTypes = {
  children: PropTypes.any
};

PatientOnly.propTypes = {
  children: PropTypes.any
};
