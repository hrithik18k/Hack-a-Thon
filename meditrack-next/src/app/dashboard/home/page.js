"use client";

import Dashboard from "../../../components/Dashboard";
import { Admin } from "../../../middleware/route";

export default function DashboardHomePage() {
  return <Admin><Dashboard type="home" /></Admin>;
}
