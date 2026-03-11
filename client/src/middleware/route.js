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
  } catch (e) {}
  return <Navigate to={"/"} replace={true} />;
};

export const DoctorOnly = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to={"/"} replace={true} />;
  try {
    const user = jwtDecode(token);
    if (user.role === "Doctor") return children;
  } catch (e) {}
  return <Navigate to={"/"} replace={true} />;
};

export const PharmacistOnly = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to={"/"} replace={true} />;
  try {
    const user = jwtDecode(token);
    if (user.role === "Pharmacist") return children;
  } catch (e) {}
  return <Navigate to={"/"} replace={true} />;
};
