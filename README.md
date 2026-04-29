# Medi Track

Medi Track is a full-stack healthcare platform for appointment booking, medical record management, doctor workflows, and emergency patient lookup. It serves three core roles, patients, doctors, and admins, and combines a modern web application with ESP32-based fingerprint device support for critical access scenarios.

Live app: [https://medi-track-sable.vercel.app/](https://medi-track-sable.vercel.app/)

## Overview

This repository uses the Next.js application in `meditrack-next/` as the active production app.

The project was migrated from a split React frontend and Express backend into a single Next.js 14 App Router codebase while preserving the original MongoDB/Mongoose domain models and core workflows.

## Repository Layout

```text
Medi-Track/
|-- meditrack-next/      # Main Next.js 14 application
|-- esp32-firmware/      # ESP32 device-side code
|-- medi-track-slides/   # Slidev presentation deck
|-- README.md
`-- .gitignore
```

## Main Application

The primary app lives in:

```text
meditrack-next/
```

Key areas inside the app:

```text
meditrack-next/
|-- src/
|   |-- app/             # App Router pages and API route handlers
|   |-- components/      # Reusable UI components
|   |-- controllers/     # Business logic reused by route handlers
|   |-- helper/
|   |-- lib/             # Auth, DB, validation, adapters
|   |-- middleware/
|   |-- models/          # Mongoose models
|   |-- redux/           # Redux Toolkit state
|   |-- service/
|   `-- styles/
|-- public/
|-- server.js            # Custom Node server for Socket.io support
|-- next.config.js
`-- package.json
```

## Features

### Patients

- Register and sign in with JWT-backed `httpOnly` session cookies.
- Search approved doctors by city and specialization.
- Book appointments using available time slots.
- View prescriptions, reports, and medical history.
- Receive in-app notifications.

### Doctors

- Apply for verification and onboarding approval.
- Manage appointments and patient interactions.
- Configure consultation slot availability.
- Publish reports after completed appointments.
- Register and use the ESP32 fingerprint device for emergency lookup flows.

### Admins

- View platform dashboard statistics.
- Manage users and doctors.
- Approve or reject doctor applications.
- Remove users or doctors when required.

## Tech Stack

- Next.js 14 App Router
- React 18
- Redux Toolkit
- MongoDB with Mongoose
- JWT authentication
- Secure cookie-based browser sessions
- Bcrypt password hashing
- Nodemailer email delivery
- Socket.io with a custom Node server
- Vanilla CSS

## Migration Notes

- React Router pages were migrated to Next.js file-based routing.
- Express endpoints were moved to App Router route handlers under `src/app/api`.
- Existing Mongoose models were preserved in `src/models`.
- Model registration uses the `mongoose.models.ModelName || mongoose.model(...)` pattern to avoid `OverwriteModelError` during hot reload.
- Client-side environment variables now use the `NEXT_PUBLIC_` prefix.
- Real-time Socket.io support runs through `server.js` for local or custom Node hosting.
- Vercel deploys the Next.js app, but it does not run the custom Socket.io server process.

## API Surface

The migrated API is organized under:

```text
src/app/api/user/*
src/app/api/doctor/*
src/app/api/appointment/*
src/app/api/notification/*
src/app/api/report/*
src/app/api/device/*
```

Supporting utilities:

- Auth helper: `src/lib/auth.js`
- Database connection: `src/lib/dbConnect.js`
- Validation logic: `src/lib/userValidation.js`
- Controller adapter: `src/lib/controllerAdapter.js`

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

For Vercel, update these values at minimum:

```env
CLIENT_URL=https://medi-track-sable.vercel.app
NEXT_PUBLIC_SERVER_DOMAIN=https://medi-track-sable.vercel.app
EMAIL_TEXT=Click here to reset your password: https://medi-track-sable.vercel.app/resetpassword/
```

Keep your production values for `MONGO_URI`, `JWT_SECRET`, email credentials, and Cloudinary credentials in the Vercel environment settings.

## Local Development

Install dependencies and start the main app:

```bash
cd meditrack-next
npm install
npm run dev
```

The app runs at:

```text
http://localhost:3000
```

Useful scripts:

```bash
npm run dev       # Start custom Node server
npm run next:dev  # Start plain Next.js dev server
npm run build     # Production build
npm start         # Start custom production server
npm test          # Run focused automated tests
```

If port `3000` is already in use, stop the existing process or set a different `PORT`.

## Deployment

Production URL:

```text
https://medi-track-sable.vercel.app/
```

Recommended Vercel settings:

```text
Framework Preset: Next.js
Root Directory: meditrack-next
Build Command: npm run build
Install Command: npm install
Output Directory: default
```

Redeploy the app after changing any Vercel environment variable.

## Notes

- The active application in this repository is `meditrack-next/`.
- `.env.local` is ignored and should never be committed.
- A `401` from protected routes usually means no valid JWT token was sent.
- A `400` from login usually means invalid credentials or malformed request data.
- Some browser-side warnings can come from extensions injecting attributes into the page.
- Socket.io behavior in local development may differ from Vercel because Vercel does not run the custom server process.

## Testing

Run the project tests with:

```bash
cd meditrack-next
npm test
```
