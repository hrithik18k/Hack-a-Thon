"use client";

import Dashboard from "../../../components/Dashboard";
import { Admin } from "../../../middleware/route";

export default function DashboardUsersPage() {
  return <Admin><Dashboard type="users" /></Admin>;
}
