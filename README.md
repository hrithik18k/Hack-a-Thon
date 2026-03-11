# IoT-Enabled Patient Health Records Management System

## Overview
An integrated IoT-enabled platform combining secure data management with intelligent automation to address critical healthcare challenges including fragmented patient records, medication errors, and elderly patient medication management.

## Key Features

1. **Centralized Health Records**
   - Centralized storage of comprehensive patient medical records.
   - Includes diagnosis history, prescriptions, vital signs, allergies, and medications.

2. **Biometric & OTP Authentication**
   - Multi-factor authentication combining R305 fingerprint biometric sensors with OTP verification.
   - Complete data control resides with patients. Providers cannot access records without explicit patient authorization.

3. **Cross-Hospital Interoperability**
   - Seamless information exchange across multiple facilities.
   - All access attempts are logged with timestamps, facility details, and personnel information, ensuring complete accountability.

4. **Integrated Pharmacy Module**
   - Eliminates paper prescriptions through fingerprint-based authentication.
   - Pharmacy dashboards instantly display current prescriptions, allergy alerts, and medication history.
   - One-click dispensing automatically updates patient records, preventing fraud and ensuring medication tracking.

5. **Smart Medicine Dispenser (IoT)**
   - Arduino-controlled compartmentalized boxes with servo motor locks automatically unlock correct compartments at doctor-scheduled times.
   - LCD displays, buzzers, and LEDs provide clear medication guidance.
   - Missed dose alerts notify family members via MQTT protocol, improving compliance.

## Technologies Used
- Frontend: HTML5, CSS3, JavaScript, React.js
- Backend: PHP, Node.js, Express, MySQL / MongoDB
- Hardware/IoT: Arduino/NodeMCU, ESP8266 WiFi modules, R305 Fingerprint sensors
- Protocol: MQTT for real-time alerts

## Roles
- Administrators
- Doctors
- Pharmacists
- Patients

## Benefits
- 40% reduction in medication errors
- Faster emergency treatment
- Complete medical history portability
- Enhanced data security through patient-controlled access
- Highly affordable & scalable (Hardware costs under ₹5,000)

## Future Enhancements
- Machine learning for diagnosis assistance
- Blockchain for data integrity
- Wearable device integration

---
_This project advances patient-centric healthcare technology, focusing on data security, hardware integrations, and cross-hospital interoperability._
