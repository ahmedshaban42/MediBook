# MediBook

Backend REST API for a medical appointment booking platform. Patients book appointments with doctors, admins review and confirm bookings, and doctors write medical records that are emailed to patients as PDF prescriptions.

Built with Node.js, Express and MySQL (Sequelize).

## Features

**Three roles, each with its own login and routes**
- **Patient:** sign up with email OTP verification, log in, book / reschedule / cancel appointments, upload profile and cover pictures, upload medical files to an appointment, rate doctors, view their own medical history.
- **Doctor:** account is created by an admin, log in, update profile and password, list the day's appointments, mark appointments as completed, write and update medical history.
- **Admin:** create doctor accounts, confirm or cancel bookings, search doctors and patients, view appointments by doctor, patient or day, view all medical history and ratings, delete ratings.

**Appointments**
- Booking time is sent with the patient's own timezone and stored as Cairo time.
- Bookings are limited to 8:00 AM to 8:00 PM, future dates only.
- A doctor cannot have two appointments within 30 minutes of each other, and at most 5 per day.
- Two types: `in_person` or `video`. Video appointments create a Zoom meeting automatically (Zoom Server-to-Server OAuth) and email the link.
- Status flow: `pending` -> `confirmed` / `canceld` (admin) -> `completed` (doctor).

**Medical records**
- A doctor can create a record (notes, diagnosis, medications, requested tests) only for a confirmed appointment, one per appointment.
- The record is rendered to a PDF prescription with Puppeteer and emailed to the patient.
- Patients can attach up to 5 images per upload (stored on Cloudinary) with a file type such as x-ray, blood test, MRI, CT scan, ECG.

**Ratings**
- Each patient can rate a doctor once (1 to 5, optional comment). The doctor's average rating is recalculated on every add or delete.

**Security and quality**
- JWT access and refresh tokens, role-based authorization, token blacklist on sign out.
- Passwords and OTPs hashed with bcrypt.
- Request validation with Joi, a global error handler, rate limiting (100 requests per 15 minutes), CORS allow-list.
- Transactional emails (OTP, booking details, cancellation, prescription) through Nodemailer.

## Tech stack

| Area | Tools |
| --- | --- |
| Runtime / framework | Node.js (ES modules), Express |
| Database | MySQL, Sequelize ORM |
| Auth | JSON Web Tokens, bcrypt |
| Validation | Joi |
| Files | Multer, Cloudinary |
| Email | Nodemailer (Gmail SMTP) |
| PDF | Puppeteer |
| Video calls | Zoom API |
| Dates | Luxon |
| Protection | express-rate-limit, CORS |

## Project structure

```
index.js                 entry point
src/
  main.js                app bootstrap (env, DB sync, CORS, routes)
  config/                Cloudinary config
  constants/             enums (appointment status, blood types, file types)
  DB/                    Sequelize connection and models + associations
  Middleware/            auth, validation, booking rules, uploads, error handling
  Modules/               Auth (user, doctor, admin), user, doctor, admin,
                         MedicalHistory, rating, appointmentFile
  Services/              email service
  Validators/            Joi schemas
  utils/                 JWT, encryption, Zoom, PDF generation, router setup
```

## Getting started

### Prerequisites
- Node.js 18+
- MySQL running locally
- Accounts for Cloudinary, Gmail (app password) and Zoom (Server-to-Server OAuth app) if you want uploads, emails and video appointments

### Installation
```bash
git clone https://github.com/ahmedshaban42/MediBook.git
cd MediBook
npm install
mkdir uploads
```

Create a MySQL database named `hospital` (default settings are in `src/DB/conection.js`; adjust them to your setup). Tables are created automatically on start.

### Environment variables
Create `src/config/.dev.env` (the app loads `src/config/.<NODE_ENV>.env`):

```env
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173
SALT=10

JWT_ACCESS_TOKEN_SECRETKEY_LOGIN=your_access_secret
JWT_ACCESS_TOKEN_EXP_LOGIN=1h
JWT_REFRESH_TOKEN_SECRETKEY_LOGIN=your_refresh_secret
JWT_REFRESH_TOKEN_EXP_LOGIN=7d

USER_EMAIL=your_gmail_address
USER_PASS=your_gmail_app_password

CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
CLOUDINARY_FOLDER=medibook

ZOOM_ACCOUNT_ID=
ZOOM_CLIENT_ID=
ZOOM_CLIENT_SECRET=
```

### Run
```bash
npm run start:dev   # development (nodemon)
npm start           # plain node
```

On macOS or Linux you can also run `NODE_ENV=dev npm start`.

## API overview

Protected routes expect `Authorization: Bearer <accessToken>`.

| Prefix | Who | Main endpoints |
| --- | --- | --- |
| `/auth-user` | Patient | `POST /signUp-user`, `/confirm-email`, `/resend-otp`, `/login-user`, `/forget-password`, `PUT /reset-password`, `/signout-user` |
| `/user` | Patient | `PATCH /update-patient-profile`, `PUT /update-patient-password`, `GET /get-all-doctors`, `POST /Appointment-Booking`, `PATCH /Modify-Booking-Date`, `DELETE /Cancellation`, `GET /get-all-appointments`, profile and cover picture upload and delete |
| `/auth-doctor` | Doctor | `POST /login-doctor`, `/signout-Doctor` |
| `/doctor` | Doctor | `GET /doctors`, `PUT /update-profile-data`, `PUT /update-password`, `PATCH /completed-appointmentStatus/:appointmentId`, `GET /get-All-Appointment-In-day` |
| `/auth-admin` | Admin | `POST /login-admin`, `/signout-admin` |
| `/admin` | Admin | `POST /admin-create-doctor-account`, `/confirm-doctor-account`, `PUT /Booking-Review/:appointmentId`, `GET /findAppointmentDoctor`, `/findAppointmentpatient`, `/getAllAppointmentInday`, `/Search-for-a-doctor-or-patient`, profile and cover picture upload and delete |
| `/MedicalHistory` | Doctor, patient, admin | doctor: create, read, update; patient: read own; admin: filtered read |
| `/Rating` | Patient, admin | `POST /add-rating/:doctor_id`, `GET /get-all-rating-doctor/:doctorid`, `GET /get-all-rating`, `DELETE /delete-rating/:ratingid` |
| `/AppointmentFiles` | Patient | `POST /upload-files-to-appoiment` (up to 5 images) |

### Example: book an appointment
```http
POST /user/Appointment-Booking
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "doctor_id": 1,
  "dateTime": "10-12-2026 10:30 AM",
  "timezone": "Africa/Cairo",
  "appointmenttype": "in_person"
}
```

## Database

Tables: `tbl_patients`, `tbl_doctors`, `tbl_admins`, `tbl_appointments`, `tbl_MedicalHistory`, `tbl_ratings`, `tbl_appointmentFile`, `tbl_blacklist`.

- A patient and a doctor have many appointments, medical records and ratings.
- An appointment has at most one medical record and many files.
- An admin is linked to the appointments they reviewed.

## Deployment

MediBook is a long-running Express server that needs a MySQL database, a writable `uploads/` folder and Chromium for Puppeteer. Platforms such as Render, Railway or a VPS with a hosted MySQL database suit it well. Set the environment variables above in the platform dashboard.

## Author

Ahmed Shaban, [github.com/ahmedshaban42](https://github.com/ahmedshaban42)
