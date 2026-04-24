"use client";

import PropTypes from "prop-types";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/lib/useAuthSession";

export const Protected = ({ children }) => {
  const router = useRouter();
  const { ready, user } = useAuthSession();

  useEffect(() => {
    if (ready && !user) router.replace("/");
  }, [ready, user, router]);

  if (!ready || !user) return null;
  return children;
};

export const Public = ({ children }) => {
  const router = useRouter();
  const { ready, user } = useAuthSession();

  useEffect(() => {
    if (ready && user) router.replace("/");
  }, [ready, user, router]);

  if (!ready || user) return null;
  return children;
};

export const Admin = ({ children }) => {
  const router = useRouter();
  const { ready, user } = useAuthSession();

  useEffect(() => {
    if (ready && user?.role !== "Admin") router.replace("/");
  }, [ready, user, router]);

  if (!ready) return null;
  if (user?.role === "Admin") return children;
  return null;
};

export const DoctorOnly = ({ children }) => {
  const router = useRouter();
  const { ready, user } = useAuthSession();

  useEffect(() => {
    if (ready && user?.role !== "Doctor") router.replace("/");
  }, [ready, user, router]);

  if (!ready) return null;
  if (user?.role === "Doctor") return children;
  return null;
};

export const PatientOnly = ({ children }) => {
  const router = useRouter();
  const { ready, user } = useAuthSession();

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
