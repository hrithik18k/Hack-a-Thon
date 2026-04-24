"use client";

import Dashboard from "../../../components/Dashboard";
import { Admin } from "../../../middleware/route";

export default function DashboardDoctorsPage() {
  return <Admin><Dashboard type="doctors" /></Admin>;
}
