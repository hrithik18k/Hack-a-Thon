# 🏥 [MediConnect](https://mediconnect-fqk1.onrender.com) - Healthcare Appointment & Medical History Ecosystem

![MediConnect Banner](https://img.shields.io/badge/MediConnect-Healthcare_Platform-040d21?style=for-the-badge&logo=react)


**MediConnect** is an advanced, enterprise-grade, yet empathy-focused platform that bridges the gap between doctors and patients. Built with a stunning **Premium Glassmorphism** design, it provides a unified, stress-free appointment ecosystem. 

Patients can seamlessly search for specialized doctors (with robust case-insensitive filtering by city), securely schedule visits, and maintain an organized, chronological record of their medical history. Doctors can efficiently manage their appointments, draft complete patient reports, and utilize modern tools so they can focus entirely on what matters most: patient care. 🚀

---

## ✨ Features

### 🧑‍⚕️ For Patients
- **Find Doctors Easily:** Robust, case-insensitive search by City and Specialization.
- **Appointment Booking:** Seamlessly pick dates, view available slots, and book consultations.
- **Medical History:** All past medical reports and prescriptions are securely stored chronologically in the patient's profile.
- **Secure Authentication:** JWT-based login, intuitive password reset flow via Email.
- **Biometric Ready:** Dedicated hub to update fingerprints (Feature rolling out soon!).

### 🩺 For Doctors
- **Doctor Onboarding:** Apply to be a verified practitioner on the platform.
- **Appointment Management:** Accept, manage, and track incoming patient consultations.
- **Report Generation:** Write and instantly attach medical reports/prescriptions directly to a patient's medical history.
- **Emergency Hub:** Specialized mode to quickly retrieve patient history via biometric fingerprint scanning (Feature rolling out soon!).

### 🛡️ For Admins
- **Interactive Dashboard:** Supervise the entire platform ecosystem.
- **Application Validation:** Approve or reject incoming verifications from newly registered doctors.
- **User Management:** Monitor patients, view platform statistics, and remove doctors if necessary.
- **Strict Registration:** Unprecedented security; public Admin registration is fully restricted on the backend.

### 🎨 General Platform UI/UX
- **Dynamic Theming:** Seamless Dark 🌙 / Light ☀️ Mode toggler persisting via LocalStorage.
- **Premium Aesthetics:** Fully responsive UI engineered with **Enterprise Medical Glassmorphism** (soft glass blur, luminous glow, glowing accents on deep navy/midnight backgrounds).
- **In-App Notifications:** Real-time push toast alerts for all activities.

---

## 💻 Tech Stack

### Frontend
- **React.js** - Client-side UI framework.
- **Redux Toolkit** - Powerful and optimized global state management.
- **React-Router-Dom** - Secure protected & public routing mechanics.
- **Axios** - Intercepting and handling robust API requests.
- **Vanilla CSS3** - Custom, meticulously grouped styles containing CSS custom variables for theming.

### Backend
- **Node.js & Express.js** - Server ecosystem.
- **MongoDB (Mongoose)** - NoSQL Database for robust and scalable data management.
- **JSON Web Tokens (JWT)** - Highly encrypted, stateless user authentication.
- **Bcrypt.js** - Advanced password hashing.
- **Nodemailer** - For transactional email workflows (e.g. Password Resets).
- **Socket.io** - (Backend scaffolding integrated for real-time notification streams).

---

## 🛠️ Installation & Local Setup

If you want to view, experiment, or contribute to the platform locally:

### 1. Clone the repository
```bash
git clone https://github.com/hrithik18k/Hack-a-Thon.git
cd Hack-a-Thon
```

### 2. Setup the Backend
Navigate to the `server/` directory, install dependencies, and configure environment variables.
```bash
cd server
npm install
```
Create a `.env` file in the `/server` directory:
```env
MONGO_URI=your_mongodb_cluster_url
JWT_SECRET=your_super_secret_key
PORT=8000
CLIENT_URL=http://localhost:3000

EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM="MediConnect Support"
EMAIL_SUB="Password Reset Request"
EMAIL_TEXT="Click here to reset your password: http://localhost:3000/resetpassword/"
```
Start the backend server:
```bash
npm run dev
# Server will run on http://localhost:8000
```

### 3. Setup the Frontend
Open a new terminal, navigate to the `client/` directory and install the packages.
```bash
cd client
npm install
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
# Client will run on http://localhost:3000
```

---

## 🌍 Deployment
This application is scalable and designed to be effortlessly deployed. 

- **Backend:** Hosted dynamically on [Render](https://render.com/), equipped with customized conditional logic to prevent crashing whether running side-by-side with React or functioning as a standalone API.
- **Frontend:** Continually deployed securely as a Static Site relying on environment variables.

> **Important Note regarding Environment Variables:** Since `.env` files are rightfully part of `.gitignore`, production credentials must be manually entered into the Render Environment variable dashboards for both backend services and frontend static deployments to function successfully.

---

<p align="center">
  Built with ❤️ for a Healthier Tomorrow
</p>
