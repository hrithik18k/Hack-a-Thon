---
theme: seriph
background: https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  ## Medi-Track
  Healthcare appointment and biometric emergency access system.
drawings:
  persist: false
transition: slide-left
title: Medi-Track
---

# Medi-Track

Healthcare appointment and medical history platform

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

<div class="abs-br m-6 flex gap-2">
  <a href="https://github.com/hrithik18k/Hack-a-Thon" target="_blank" alt="GitHub" title="Open in GitHub"
    class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon:logo-github />
  </a>
  <a href="https://medi-track-sable.vercel.app/" target="_blank" alt="Live Demo" title="Open Live Demo"
    class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon:link />
  </a>
</div>

<!--
Welcome to the Medi-Track presentation. Medi-Track is a comprehensive healthcare appointment and medical history platform that uniquely integrates with hardware for emergency access.
-->

---
transition: fade-out
layout: center
---

# Problem Statement

<div class="text-xl mt-4">
  <v-click>
    <div class="flex items-center gap-4 mb-4">
      <carbon:warning-alt class="text-red-500 text-3xl" />
      <div><strong>Fragmented Systems:</strong> Managing appointments, reports, and records is slow.</div>
    </div>
  </v-click>
  <v-click>
    <div class="flex items-center gap-4 mb-4">
      <carbon:time class="text-orange-500 text-3xl" />
      <div><strong>Emergency Delays:</strong> Identifying unconscious patients is difficult.</div>
    </div>
  </v-click>
  <v-click>
    <div class="flex items-center gap-4">
      <carbon:data-error class="text-yellow-500 text-3xl" />
      <div><strong>Data Silos:</strong> Doctors lack immediate access to holistic medical history.</div>
    </div>
  </v-click>
</div>

<!--
The healthcare sector faces three primary challenges:
1. Systems are fragmented.
2. In emergencies, identifying an unconscious patient and accessing their medical history is critical but often delayed.
3. Doctors struggle with data silos.
-->

---
layout: image-right
image: https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop
transition: slide-up
---

# Proposed Solution

Medi-Track provides an integrated ecosystem for all healthcare stakeholders:

- <carbon:user-multiple class="text-blue-500"/> **Patient booking** & profile management
- <carbon:document class="text-green-500"/> **Doctor report** management & publication
- <carbon:dashboard class="text-purple-500"/> **Admin dashboard** for oversight
- <carbon:notification class="text-yellow-500"/> **Real-time notifications** for updates
- <carbon:fingerprint-recognition class="text-red-500"/> **ESP32 fingerprint-based** emergency patient lookup

<!--
Our solution, Medi-Track, solves this by bridging the gap between software and hardware.
We provide a unified platform for patients, doctors, and admins. The standout feature is our ESP32-based biometric lookup for emergencies.
-->

---
layout: statement
---

# User Roles

Medi-Track is built for three primary users:

<div class="grid grid-cols-3 gap-8 mt-10">
  <div v-click class="p-6 bg-blue-500 bg-opacity-10 rounded-lg text-center border border-blue-500 border-opacity-30">
    <carbon:user class="text-5xl text-blue-400 mx-auto mb-4" />
    <h3 class="text-2xl font-bold">Patients</h3>
    <p class="text-sm mt-2 opacity-80">Book appointments, view medical history, setup biometrics</p>
  </div>
  <div v-click class="p-6 bg-green-500 bg-opacity-10 rounded-lg text-center border border-green-500 border-opacity-30">
    <carbon:stethoscope class="text-5xl text-green-400 mx-auto mb-4" />
    <h3 class="text-2xl font-bold">Doctors</h3>
    <p class="text-sm mt-2 opacity-80">Manage appointments, review histories, publish reports</p>
  </div>
  <div v-click class="p-6 bg-purple-500 bg-opacity-10 rounded-lg text-center border border-purple-500 border-opacity-30">
    <carbon:user-admin class="text-5xl text-purple-400 mx-auto mb-4" />
    <h3 class="text-2xl font-bold">Admins</h3>
    <p class="text-sm mt-2 opacity-80">System oversight, user management, analytics</p>
  </div>
</div>

<!--
The system caters to patients, doctors, and administrators, with tailored dashboards and permissions for each role.
-->

---
layout: two-cols
transition: slide-left
---

# Core Features

Discover the functionalities that power Medi-Track:

<v-clicks>

- <carbon:locked class="mr-2 text-blue-400" /> User registration and login
- <carbon:search class="mr-2 text-cyan-400" /> Doctor search and filtering
- <carbon:calendar class="mr-2 text-orange-400" /> Appointment booking system
- <carbon:document class="mr-2 text-green-400" /> Medical report publishing
- <carbon:reminder-medical class="mr-2 text-pink-400" /> Comprehensive medical history
- <carbon:chip class="mr-2 text-purple-400" /> Device setup for fingerprint scanner
- <carbon:warning-alt class="mr-2 text-red-400" /> Emergency patient identification

</v-clicks>

::right::

<div class="h-full flex items-center justify-center p-8">
  <div class="relative w-full aspect-square max-w-md">
    <img src="https://images.unsplash.com/photo-1551076805-e1869043e560?q=80&w=2000&auto=format&fit=crop" class="rounded-xl shadow-2xl object-cover w-full h-full" />
    <div class="absolute -bottom-4 -right-4 bg-white dark:bg-dark-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-3">
        <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <span class="font-semibold text-gray-800 dark:text-gray-200">System Online</span>
      </div>
    </div>
  </div>
</div>

<!--
Our core features cover the entire lifecycle of a medical visit, from booking to diagnosis and record keeping, enhanced by biometric emergency access.
-->

---
layout: center
class: text-center
---

# Unique Feature

### ESP32 Fingerprint Scanner Integration

<div class="mt-8 p-6 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl shadow-2xl border border-blue-400">
  <carbon:fingerprint-recognition class="text-7xl text-blue-300 mx-auto mb-4" />
  <h2 class="text-2xl font-bold text-white mb-2">Emergency Patient Lookup</h2>
  <p class="text-blue-100 max-w-lg mx-auto">
    In critical situations where a patient is unresponsive, medical staff can scan their fingerprint to instantly retrieve vital medical records, blood type, and allergies.
  </p>
</div>

<!--
This is what sets us apart. Using an ESP32 microcontroller and a biometric fingerprint scanner, we created a hardware solution that integrates seamlessly with our web platform.
-->

---
layout: default
---

# Tech Stack

Built with modern, scalable technologies.

<div class="grid grid-cols-2 gap-x-12 gap-y-6 mt-8">
  <div>
    <h3 class="flex items-center gap-2 text-xl font-bold text-blue-400 border-b border-gray-700 pb-2 mb-4">
      <carbon:laptop /> Frontend
    </h3>
    <ul class="space-y-2">
      <li><carbon:application-web class="mr-2" /> Next.js 14</li>
      <li><carbon:logo-react class="mr-2" /> React 18</li>
      <li><carbon:app-switcher class="mr-2" /> Redux Toolkit</li>
      <li><carbon:color-palette class="mr-2" /> Tailwind CSS</li>
    </ul>
  </div>
  <div>
    <h3 class="flex items-center gap-2 text-xl font-bold text-green-400 border-b border-gray-700 pb-2 mb-4">
      <carbon:data-base /> Backend
    </h3>
    <ul class="space-y-2">
      <li><carbon:bare-metal-server class="mr-2" /> Node.js & Express</li>
      <li><carbon:database-mongodb class="mr-2" /> MongoDB & Mongoose</li>
      <li><carbon:security class="mr-2" /> JWT Authentication</li>
      <li><carbon:api class="mr-2" /> Socket.io (Real-time)</li>
    </ul>
  </div>
</div>

<div class="mt-8">
  <h3 class="flex items-center gap-2 text-xl font-bold text-orange-400 border-b border-gray-700 pb-2 mb-4">
    <carbon:iot-platform /> Hardware Integration
  </h3>
  <div class="flex items-center gap-4">
    <carbon:chip class="text-3xl" />
    <span>ESP32 device with Fingerprint Sensor, integrated via API & WebSockets.</span>
  </div>
</div>

<!--
We chose a MERN-like stack with Next.js for SSR and SEO. Redux for state management. MongoDB for flexible schema design. Hardware uses ESP32 with C++ (Arduino framework).
-->

---
layout: center
---

# Architecture Overview

<div class="flex justify-center bg-white p-4 rounded-xl mt-4 max-w-full overflow-x-auto text-black">

```mermaid
flowchart LR
    %% Define Styles
    classDef frontend fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff,rx:10px
    classDef backend fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff,rx:10px
    classDef database fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff,rx:10px
    classDef hardware fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff,rx:10px

    %% Nodes
    A[Users] -->|HTTPS| B(Next.js Frontend):::frontend
    B -->|REST / WS| C{Node.js API Route}:::backend
    C -->|Controllers| D(Business Logic):::backend
    D -->|Mongoose| E[(MongoDB)]:::database

    F[ESP32 Device]:::hardware -->|WiFi / HTTP| C
    C -->|Fetch| G(Medical Reports)
    G -->|Response| H[Emergency UI]:::frontend
```
</div>

<!--
Here is the system architecture. Notice how the hardware directly communicates with our Node.js backend over WiFi to trigger the emergency lookup flow.
-->

---
layout: default
---

# Demo Flow

Here is what we will demonstrate today:

<div class="mt-8">
  <ol class="relative border-s border-gray-200 dark:border-gray-700 ml-4">
      <li class="mb-6 ms-6" v-click>
          <span class="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
              1
          </span>
          <h3 class="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Patient Onboarding</h3>
          <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">Patient registers, logs in, and enrolls their fingerprint.</p>
      </li>
      <li class="mb-6 ms-6" v-click>
          <span class="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
              2
          </span>
          <h3 class="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Appointment Booking</h3>
          <p class="text-base font-normal text-gray-500 dark:text-gray-400">Patient finds a doctor and books an appointment.</p>
      </li>
      <li class="mb-6 ms-6" v-click>
          <span class="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
              3
          </span>
          <h3 class="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Doctor Management</h3>
          <p class="text-base font-normal text-gray-500 dark:text-gray-400">Doctor reviews the appointment and publishes a medical report.</p>
      </li>
      <li class="ms-6" v-click>
          <span class="absolute flex items-center justify-center w-8 h-8 bg-red-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-red-900 text-red-600">
              <carbon:warning />
          </span>
          <h3 class="mb-1 text-lg font-semibold text-red-600 dark:text-red-400">Emergency Scenario</h3>
          <p class="text-base font-normal text-gray-500 dark:text-gray-400">Scanner reads fingerprint, instantly opening the patient's critical health records.</p>
      </li>
  </ol>
</div>

<!--
Our demo will walk you through a typical patient journey, followed by an emergency situation where our hardware integration truly shines.
-->

---
layout: default
transition: slide-up
---

# Future Scope

We have big plans for Medi-Track's future:

<div class="grid grid-cols-2 gap-6 mt-8">
  <div v-click class="p-5 border border-gray-200 dark:border-gray-700 rounded-lg">
    <div class="flex items-center gap-3 mb-2">
      <carbon:hospital class="text-2xl text-blue-500" />
      <h3 class="text-xl font-semibold">Hospital-wide Deployment</h3>
    </div>
    <p class="text-sm text-gray-500 dark:text-gray-400">Scaling the system for multi-hospital network connectivity.</p>
  </div>

  <div v-click class="p-5 border border-gray-200 dark:border-gray-700 rounded-lg">
    <div class="flex items-center gap-3 mb-2">
      <carbon:devices class="text-2xl text-green-500" />
      <h3 class="text-xl font-semibold">Multi-device Support</h3>
    </div>
    <p class="text-sm text-gray-500 dark:text-gray-400">Mobile applications for doctors and patients on iOS and Android.</p>
  </div>

  <div v-click class="p-5 border border-gray-200 dark:border-gray-700 rounded-lg">
    <div class="flex items-center gap-3 mb-2">
      <carbon:notification class="text-2xl text-red-500" />
      <h3 class="text-xl font-semibold">Emergency Alert Integration</h3>
    </div>
    <p class="text-sm text-gray-500 dark:text-gray-400">SMS and automated calls to emergency contacts upon scan.</p>
  </div>

  <div v-click class="p-5 border border-gray-200 dark:border-gray-700 rounded-lg">
    <div class="flex items-center gap-3 mb-2">
      <carbon:chart-line class="text-2xl text-purple-500" />
      <h3 class="text-xl font-semibold">Analytics Dashboard</h3>
    </div>
    <p class="text-sm text-gray-500 dark:text-gray-400">AI-driven insights for hospital management and disease tracking.</p>
  </div>
</div>

<!--
Looking ahead, we want to expand the platform's reach. Adding an AI layer for analytics and integrating with regional emergency dispatch systems are our next milestones.
-->

---
layout: center
class: text-center
---

# Thank You

<div class="text-2xl mt-4 mb-8 text-gray-500">
  Any Questions?
</div>

<div class="flex justify-center gap-4 mt-8">
  <a href="https://github.com/hrithik18k/Hack-a-Thon" target="_blank" class="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition !border-none !text-white">
    <carbon:logo-github />
    Source Code
  </a>
  <a href="https://medi-track-sable.vercel.app/" target="_blank" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition !border-none !text-white">
    <carbon:link />
    Live Demo
  </a>
</div>

<PoweredBySlidev mt-10 />

<!--
Thank you for your time and attention! We are happy to answer any questions about the platform, our hardware integration, or the codebase.
-->
