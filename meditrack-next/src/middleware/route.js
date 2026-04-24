"use client";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { useRouter } from "next/navigation";

const useAuthState = () => {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || "";
    setToken(storedToken);
    try {
      setUser(storedToken ? jwtDecode(storedToken) : null);
    } catch (error) {
      console.error("Token decoding error:", error);
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  return { ready, token, user };
};

export const Protected = ({ children }) => {
  const router = useRouter();
  const { ready, token } = useAuthState();

  useEffect(() => {
    if (ready && !token) router.replace("/");
  }, [ready, token, router]);

  if (!ready || !token) return null;
  return children;
};

export const Public = ({ children }) => {
  const router = useRouter();
  const { ready, token } = useAuthState();

  useEffect(() => {
    if (ready && token) router.replace("/");
  }, [ready, token, router]);

  if (!ready || token) return null;
  return children;
};

export const Admin = ({ children }) => {
  const router = useRouter();
  const { ready, user } = useAuthState();

  useEffect(() => {
    if (ready && user?.role !== "Admin") router.replace("/");
  }, [ready, user, router]);

  if (!ready) return null;
  if (user?.role === "Admin") return children;
  return null;
};

export const DoctorOnly = ({ children }) => {
  const router = useRouter();
  const { ready, user } = useAuthState();

  useEffect(() => {
    if (ready && user?.role !== "Doctor") router.replace("/");
  }, [ready, user, router]);

  if (!ready) return null;
  if (user?.role === "Doctor") return children;
  return null;
};

export const PatientOnly = ({ children }) => {
  const router = useRouter();
  const { ready, user } = useAuthState();

  useEffect(() => {
    if (ready && user?.role !== "Patient") router.replace("/");
  }, [ready, user, router]);

  if (!ready) return null;
  if (user?.role === "Patient") return children;
  return null;
};

Protected.propTypes = {
  children: PropTypes.any,
};

Public.propTypes = {
  children: PropTypes.any,
};

Admin.propTypes = {
  children: PropTypes.any,
};

DoctorOnly.propTypes = {
  children: PropTypes.any,
};

PatientOnly.propTypes = {
  children: PropTypes.any,
};
