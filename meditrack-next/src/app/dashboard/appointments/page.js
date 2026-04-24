"use client";

import Dashboard from "../../../components/Dashboard";
import { Admin } from "../../../middleware/route";

export default function DashboardAppointmentsPage() {
  return <Admin><Dashboard type="appointments" /></Admin>;
}
