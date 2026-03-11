import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Protected, Public, Admin } from "./middleware/route";
import Loading from "./components/Loading";
import Error from "./pages/Error";

import "./styles/global.css";

const Home = lazy(() => import("./pages/Home"));
const WriteReportPage = lazy(() => import("./pages/WriteReportPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Appointments = lazy(() => import("./pages/Appointments"));
const Doctors = lazy(() => import("./pages/Doctors"));
const Profile = lazy(() => import("./pages/Profile"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MedicalHistory = lazy(() => import("./pages/MedicalHistory"));

function App() {
  return (
    <Router>
      <Toaster />
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Public><Login /></Public>} />
          <Route path="/register" element={<Public><Register /></Public>} />
          <Route path="/forgotpassword" element={<Public><ForgotPassword /></Public>} />
          <Route path="/resetpassword/:id/:token" element={<Public><ResetPassword /></Public>} />
          <Route path="/doctors" element={<Doctors />} />

          {/* Protected routes */}
          <Route path="/appointments" element={<Protected><Appointments /></Protected>} />
          <Route path="/notifications" element={<Protected><Notifications /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/changepassword" element={<Protected><ChangePassword /></Protected>} />
          <Route path="/medical-history" element={<Protected><MedicalHistory /></Protected>} />
          <Route path="/doctor/write-report" element={<Protected><WriteReportPage /></Protected>} />

          {/* Admin routes */}
          <Route path="/dashboard/home" element={<Admin><Dashboard type={"home"} /></Admin>} />
          <Route path="/dashboard/users" element={<Admin><Dashboard type={"users"} /></Admin>} />
          <Route path="/dashboard/doctors" element={<Admin><Dashboard type={"doctors"} /></Admin>} />
          <Route path="/dashboard/appointments" element={<Admin><Dashboard type={"appointments"} /></Admin>} />

          <Route path="*" element={<Error />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
