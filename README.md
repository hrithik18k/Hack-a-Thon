# Medi Track

Medi Track is a full-stack healthcare appointment and medical history platform for patients, doctors, and admins. The app has been migrated from a split React + Express project to a Next.js 14 App Router application while keeping the same MongoDB/Mongoose data models and the same core functionality.

Deployment link: https://medi-track-sable.vercel.app/

---

## Current App

The active migrated app lives in:

```text
meditrack-next/
```

This repository now uses the Next.js app as the primary application:

```text
meditrack-next/   # Next.js 14 App Router app with API route handlers
```

---

## Features

### Patients

- Register and log in securely with JWT-backed `httpOnly` session cookies.
- Search approved doctors by city and specialization.
- Book appointments with available time slots.
- View completed medical reports and prescriptions.
- Receive and read in-app notifications.

### Doctors

- Apply for doctor verification.
- Manage appointments.
- Configure available appointment slots.
- Write medical reports for completed consultations.
- Register and use an ESP32 fingerprint device for emergency/patient history workflows.

### Admins

- View dashboard statistics.
- Manage users.
- Approve or reject doctor applications.
- Remove doctors or users when needed.

---

## Tech Stack

- Next.js 14 App Router
- React 18
- Redux Toolkit
- Vanilla CSS
- API Route Handlers under `src/app/api`
- MongoDB with Mongoose
- JWT authentication
- Secure cookie-based session transport for browser clients
- Bcrypt password hashing
- Nodemailer password reset emails
- Socket.io through a custom Next server for local/custom hosting

---

## Migration Notes

- React Router routes were converted to Next.js file-based routes.
- Express routes were converted to App Router API route handlers.
- Mongoose schemas/models were copied into `meditrack-next/src/models`.
- Model registration uses `mongoose.models.ModelName || mongoose.model(...)` so Next dev hot reload does not throw `OverwriteModelError`.
- Client environment variables now use the `NEXT_PUBLIC_` prefix.
- Socket.io runs through `meditrack-next/server.js` locally or on custom Node hosting. Vercel does not run the custom Socket.io server.

---

## Project Structure

```text
meditrack-next/
|-- src/
|   |-- app/
|   |   |-- api/
|   |   |-- dashboard/
|   |   |-- doctor/
|   |   |-- layout.js
|   |   `-- page.js
|   |-- components/
|   |-- controllers/
|   |-- helper/
|   |-- lib/
|   |   |-- auth.js
|   |   |-- controllerAdapter.js
|   |   `-- dbConnect.js
|   |-- middleware/
|   |-- models/
|   |-- redux/
|   |-- service/
|   `-- styles/
|-- public/
|-- server.js
|-- next.config.js
|-- package.json
`-- .env.local
```

---

## Environment Variables

Create `meditrack-next/.env.local` for local development:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
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

Use these values in the Vercel project environment variables:

```env
CLIENT_URL=https://medi-track-sable.vercel.app
NEXT_PUBLIC_SERVER_DOMAIN=https://medi-track-sable.vercel.app
EMAIL_TEXT=Click here to reset your password: https://medi-track-sable.vercel.app/resetpassword/
```

Keep the same production values for `MONGO_URI`, `JWT_SECRET`, email credentials, and Cloudinary credentials in Vercel.

---

## Local Setup

Install and run the migrated Next app:

```bash
cd meditrack-next
npm install
npm run dev
```

The app runs at:

```text
http://localhost:3000
```

Build for production:

```bash
npm run build
```

Start the custom production server:

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

## Deployment

Production URL:

```text
https://medi-track-sable.vercel.app/
```

Vercel settings:

```text
Framework Preset: Next.js
Root Directory: meditrack-next
Build Command: npm run build
Install Command: npm install
Output Directory: default
```

After changing any Vercel environment variable, redeploy the project.

---

## Notes

- The active application is `meditrack-next/`.
- `.env.local` is ignored and must not be committed.
- Browser warnings like `fdprocessedid` usually come from extensions injecting attributes.
- A `401` from protected API routes means no valid JWT token was sent.
- A `400` from login usually means incorrect email/password, while role mismatch is handled separately.
- Core user flows now validate input centrally in `meditrack-next/src/lib/userValidation.js`.

Run the focused automated tests with:

```bash
cd meditrack-next
npm test
```
