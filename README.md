# 🏥 [Medi Track](https://mediconnect-fqk1.onrender.com) — Healthcare Appointment & Medical History Ecosystem

Medi Track is a full-stack healthcare appointment and medical history platform for patients, doctors, and admins. The app has been migrated from a split React + Express project to a Next.js 14 App Router application while keeping the same MongoDB/Mongoose data models and the same core functionality.

**Medi Track** is a full-stack, role-based healthcare platform that bridges the gap between doctors, patients, and administrators. It provides a unified appointment ecosystem with a chronological medical history system — and uniquely integrates **ESP32-based biometric fingerprint hardware** for emergency patient lookup and fingerprint enrollment, directly from within the app.

---

## Features

### 🧑‍⚕️ For Patients
- **Find Doctors Easily** — case-insensitive filtering by City and Specialization.
- **Smart Appointment Booking** — pick a date, view only available time slots (past and already-booked slots are visually disabled), and book a consultation.
- **Medical History** — chronological, collapsible timeline of all past reports. Filter by Critical vs Routine visits. Lightbox image viewer for attached scans/prescriptions.
- **Secure Authentication** — JWT-based login with role selector; password reset via email (Nodemailer + Gmail).
- **Profile Management** — update personal info, profile picture (Cloudinary), blood group, addresses, and emergency contacts.
- **Unread Notification Badge** — navbar badge updates live; clears on page visit.
- **Biometric Ready** — dedicated hub to update fingerprints (Feature rolling out soon!).

### 🩺 For Doctors
- **Appointment Management** — paginated appointment table with patient age, gender, and blood group context.
- **Slot Configuration** — set custom start/end times and per-slot duration (15/30/45/60 min) from the appointments page.
- **Report Generation** — write structured medical reports with diagnosis, doctor notes, importance flag (General / Critical), structured prescription table, image attachments (Cloudinary), and follow-up date. Publishing a report automatically marks the appointment as Completed.
- **Patient History Modal** — open a patient's full chronological medical history from any appointment row.
- **Emergency Hub** — biometric fingerprint scan via ESP32 device: scan a patient's finger to instantly retrieve their identity and full medical history.
- **Fingerprint Enrollment** — enroll a patient's fingerprint directly from the Write Report page.
- **ESP32 Device Setup** — register, configure, and monitor your personal fingerprint scanner. Token is shown once on registration and must be flashed into the ESP32 firmware.

### 🛡️ For Admins
- **Interactive Dashboard** — system-wide stats: total users, doctors (pending + approved), and appointments.
- **Application Validation** — approve or reject incoming doctor applications; view uploaded qualification certificates.
- **Doctor & User Management** — view all registered doctors and patients; delete accounts.
- **Strict Registration** — public Admin registration is fully blocked on the backend (`403` on role `"Admin"`).

### 🎨 General Platform UI/UX
- **Dynamic Theming** — seamless Dark 🌙 / Light ☀️ mode toggle, persisted in `localStorage`. Design system built on CSS custom variables with a distinct dark-mode character (navy-black base, electric teal accent).
- **"Clinical Precision" Design System** — Space Grotesk headings, Inter body, IBM Plex Mono for dates/IDs/codes. Solid surfaces with 1px borders, bottom-border-only inputs.
- **In-App Notifications** — `react-hot-toast` alerts throughout.
- **Fully Responsive** — hamburger + slide-in nav on mobile; admin sidebar slides over a backdrop; all tables are horizontally scrollable.
- **Code Splitting** — all pages are lazy-loaded via `React.lazy` + `Suspense`.

---

## Tech Stack

### Frontend
- **React 18** — UI framework with lazy loading for all pages.
- **Redux Toolkit** — global state (auth, loading).
- **React Router v6** — protected, public, admin, and doctor-only route wrappers backed by JWT decode.
- **Axios** — centralized API client with `Authorization` header injection.
- **Vanilla CSS3** — custom design system (`global.css`) with CSS variables for full theming.
- **Cloudinary** — direct browser-to-Cloudinary image uploads (profile photos, medical report images, certificates).
- **Socket.io Client** — scaffolded for real-time notifications and WebRTC call signaling.

### Backend
- **Node.js & Express.js** — Server ecosystem.
- **MongoDB (Mongoose)** — NoSQL Database; separate models for Users, Doctors, Appointments, Notifications, Medical Reports, Device State, and Doctor Devices.
- **JSON Web Tokens (JWT)** — Stateless authentication; tokens encode `userId` and `role`.
- **Bcrypt.js** — Password hashing (10 rounds).
- **Nodemailer** — Transactional email for password reset flows (Gmail transport).
- **Socket.io** — WebRTC signaling scaffolding (room join, offer/answer/ICE negotiation).

### IoT / Hardware
- **ESP32 + R307 Fingerprint Sensor** — each doctor registers a personal device, receives a one-time UUID token, and flashes it into the ESP32 firmware. The device polls `/api/device/esp/mode` every 3 seconds and posts results to `/api/device/esp/result`.

### Migration Notes

- React Router routes were converted to Next.js file-based routes.
- Express routes were converted to App Router API route handlers.
- Mongoose schemas/models were copied into `meditrack-next/src/models`.
- Model registration uses `mongoose.models.ModelName || mongoose.model(...)` so Next dev hot reload does not throw `OverwriteModelError`.
- Client environment variables now use the `NEXT_PUBLIC_` prefix.
- Socket.io runs through `meditrack-next/server.js`.

---

## Project Structure

```text
meditrack-next/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── dashboard/
│   │   ├── doctor/
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   ├── controllers/
│   ├── helper/
│   ├── lib/
│   │   ├── auth.js
│   │   ├── controllerAdapter.js
│   │   └── dbConnect.js
│   ├── middleware/
│   ├── models/
│   ├── redux/
│   ├── service/
│   └── styles/
├── public/
├── server.js
├── next.config.js
├── package.json
└── .env.local
```

### 2. Setup the Backend
Navigate to the `server/` directory, install dependencies, and configure environment variables.
```bash
cd server
npm install
```

Create a `.env` file in the `/server` directory:
```env
PORT=8000
MONGO_URI=your_mongodb_cluster_url
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:3000

EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
EMAIL_FROM=Doctor Appointment Support
EMAIL_SUB=Password Reset for your Doctor Appointment Account
EMAIL_TEXT=Click here to reset your password: http://localhost:3000/resetpassword/

NEXT_PUBLIC_SERVER_DOMAIN=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_BASE_URL=https://api.cloudinary.com/v1_1/your_cloud/image/upload
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_PRESET=your_upload_preset
NEXT_PUBLIC_REACT_FORMIK_SECRET=your_form_secret
```

Start the backend server:
```bash
npm run dev
# Server will run on http://localhost:8000
```

After deployment, update it to the deployed application URL.

---

## Local Setup

Install and run the migrated Next app:

```bash
cd meditrack-next
npm install
npm run dev
```

Create a `.env` file in the `/client` directory:
```env
REACT_APP_SERVER_DOMAIN=http://localhost:8000
REACT_APP_CLOUDINARY_BASE_URL=https://api.cloudinary.com/v1_1/your_cloud/image/upload
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_PRESET=your_preset
```

Start the React App:
```bash
npm start
```

If port `3000` is already in use, stop the existing Node process or set another `PORT`.

---

## API Routes

The Express API has been migrated to Next route handlers:

```text
src/app/api/user/*
src/app/api/doctor/*
src/app/api/appointment/*
src/app/api/notification/*
src/app/api/report/*
src/app/api/device/*
```

Authenticated route handlers call the reusable auth helper in:

```text
src/lib/auth.js
```

Database connection is managed by:

```text
src/lib/dbConnect.js
```

---

## 📁 Project Structure

```
Hack-a-Thon/
├── client/src/
│   ├── components/          # AdminAppointments, AdminDoctors, BookAppointment,
│   │                        # DoctorCard, PatientHistory, Navbar, Sidebar, etc.
│   ├── pages/               # Home, Doctors, Appointments, MedicalHistory,
│   │                        # WriteReportPage, Dashboard, Emergency, DeviceSetup, etc.
│   ├── middleware/
│   │   └── route.js         # Protected / Public / Admin / DoctorOnly route wrappers
│   ├── redux/
│   │   ├── store.js
│   │   └── reducers/rootSlice.js
│   ├── helper/
│   │   ├── apiCall.js       # Axios wrapper — injects Authorization header
│   │   └── convertImage.js  # FileReader → base64 helper
│   ├── service/
│   │   └── peer.js          # WebRTC PeerConnection service
│   └── styles/global.css    # Full design system (CSS custom properties, dark/light)
│
└── server/
    ├── controllers/
    │   ├── userController.js         # Auth, profile, password reset
    │   ├── doctorController.js       # CRUD, approval workflow, slot config
    │   ├── appointmentController.js  # Booking, slot availability generation
    │   ├── reportController.js       # Create & retrieve medical reports
    │   ├── notificationController.js
    │   ├── deviceController.js       # ESP32 token-based + website-facing device routes
    │   └── socket.js                 # Socket.io WebRTC signaling
    ├── models/
    │   ├── userModel.js              # Includes fingerprintTemplateId, emergencyContact
    │   ├── doctorModel.js            # Includes slotConfig
    │   ├── appointmentModel.js
    │   ├── medicalReportModel.js     # importance, images[], medications[]
    │   ├── notificationModel.js
    │   ├── doctorDeviceModel.js      # Per-doctor ESP32 device (token, mode, result)
    │   └── deviceStateModel.js       # Global singleton (legacy backward-compat)
    ├── routes/                       # Express routers for each domain
    ├── middleware/
    │   ├── auth.js                   # JWT verify → req.locals + req.userRole
    │   └── multerConfig.js           # PDF-only upload filter
    └── server.js                     # App entry point; attaches Socket.io
```

---

## 🔌 API Reference

### Auth / Users — `/api/user`
| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | ✗ | Register as Patient or Doctor (Admin blocked) |
| `POST` | `/login` | ✗ | Login with role selector; returns JWT |
| `POST` | `/forgotpassword` | ✗ | Send password reset email |
| `POST` | `/resetpassword/:id/:token` | ✗ | Reset password via email token |
| `GET` | `/getuser/:id` | ✓ | Get user by ID |
| `GET` | `/getallusers` | ✓ | List all non-self users |
| `PUT` | `/updateprofile` | ✓ | Update profile + picture |
| `PUT` | `/changepassword` | ✓ | Change password |
| `DELETE` | `/deleteuser` | ✓ | Admin: delete user + related data |

### Doctors — `/api/doctor`
| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/getalldoctors?city=&specialization=` | ✗ | Regex-filtered approved doctors |
| `GET` | `/getnotdoctors` | ✓ | Pending doctor applications |
| `POST` | `/applyfordoctor` | ✓ | Submit doctor application |
| `PUT` | `/acceptdoctor` | ✓ | Admin: approve |
| `PUT` | `/rejectdoctor` | ✓ | Admin: reject |
| `PUT` | `/deletedoctor` | ✓ | Admin: remove + downgrade role |
| `PUT` | `/updateslots` | ✓ | Doctor: update slot config |

### Appointments — `/api/appointment`
| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/getallappointments?search=userId` | ✓ | Filtered list |
| `POST` | `/bookappointment` | ✓ | Book; auto-calculates age from DOB |
| `PUT` | `/completed` | ✓ | Mark appointment completed |
| `GET` | `/getavailableslots?doctorId=&date=` | ✓ | Generated slots minus booked times |

### Medical Reports — `/api/report`
| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/create` | ✓ Doctor | Create report; marks appointment Completed |
| `GET` | `/mine` | ✓ Patient | Patient's own history |
| `GET` | `/patient/:patientId` | ✓ Doctor | Patient history for a doctor |
| `GET` | `/byappointment/:appointmentId` | ✓ | Report for a specific appointment |

### Notifications — `/api/notification`
| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/getallnotifs` | ✓ | All notifications (newest first) |
| `GET` | `/unreadcount` | ✓ | Count of unread |
| `PUT` | `/markallread` | ✓ | Mark all as read |

### Device (IoT) — `/api/device`
| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/setmode` | ✓ Doctor | Set device mode: idle / enroll / scan |
| `GET` | `/result` | ✓ Doctor | Poll latest fingerprint result |
| `POST` | `/doctor/register` | ✓ | Register ESP32; returns one-time token |
| `GET` | `/doctor/my-device` | ✓ | Device status + last seen |
| `DELETE` | `/doctor/unregister` | ✓ | Deactivate device |
| `GET` | `/esp/mode?token=` | ✗ | ESP32: poll current mode |
| `POST` | `/esp/result?token=` | ✗ | ESP32: push scan/enroll result |

---

## 🔒 Authentication & Role System

Three roles exist: `Patient`, `Doctor`, `Admin`. The backend enforces access via the `auth` JWT middleware (injects `req.locals` and `req.userRole`) and a `requireRole` middleware. The frontend mirrors these boundaries through four route wrappers in `client/src/middleware/route.js`.

**Admin accounts cannot be created via the public API.** The registration endpoint returns `403` if `role === "Admin"`. Admin accounts must be seeded directly in the database.

Doctor accounts start with `status: "Pending"` and cannot log in until an Admin approves the application.

---

## 🤖 ESP32 Fingerprint Integration

Each doctor owns one personal device. The flow is:

```
Doctor registers device  →  Server generates UUID token
      │
      ▼
Doctor flashes token into ESP32 firmware
      │
      ▼
ESP32 polls GET /api/device/esp/mode?token= every 3s
      │
      ┌──────────────────────────────────────┐
      ▼                                      ▼
Doctor clicks "Enroll"               Doctor clicks "Scan"
Server sets mode="enroll"            Server sets mode="scan"
      │                                      │
      ▼                                      ▼
ESP32 captures fingerprint           ESP32 matches template
POST /api/device/esp/result          POST /api/device/esp/result
      │                                      │
      ▼                                      ▼
Template saved to User               Patient identity + full
fingerprintTemplateId                medical history returned
                                     to Emergency page
```

---

## 🌍 Deployment

This application is scalable and designed to be effortlessly deployed.

- **Backend:** Hosted on [Render](https://render.com/). The server conditionally serves only the API — the commented-out static file serving block in `server.js` can be uncommented to co-host the React build alongside the API.
- **Frontend:** Continuously deployed as a Static Site relying on environment variables for server domain and Cloudinary config.

---

## Notes

- The active application is `meditrack-next/`.
- Browser warnings like `fdprocessedid` usually come from extensions injecting attributes.
- A `401` from protected API routes means no valid JWT token was sent.
- A `400` from login usually means incorrect email/password, while role mismatch is handled separately.
