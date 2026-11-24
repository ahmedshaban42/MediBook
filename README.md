# MediBook

Backend API for a medical appointment booking platform. Patients book appointments with doctors, doctors manage their schedule, and admins oversee the system.

## Features
- Three roles with separate auth and routes: patient (`/auth-user`, `/user`), doctor (`/auth-doctor`, `/doctor`), admin (`/auth-admin`, `/admin`)
- JWT authentication, password hashing with bcrypt, OTP email verification (Nodemailer)
- Appointments with status (pending by default), date/time, and type (in person or online with a Zoom link)
- Medical history records, doctor ratings with an average rating, and appointment file uploads (Multer + Cloudinary)
- Request validation with Joi, global error handler, rate limiting (100 requests per 15 minutes), CORS allow-list

## Tech stack
Node.js, Express, MySQL with Sequelize, JWT, bcrypt, Joi, Nodemailer, Multer, Cloudinary, Luxon, express-rate-limit

## Getting started
1. `git clone https://github.com/ahmedshaban42/MediBook.git && cd MediBook`
2. `npm install`
3. Create `src/config/.dev.env` (the app loads `src/config/.<NODE_ENV>.env`) with your own values: `PORT`, `FRONTEND_ORIGIN`, database settings, JWT secrets, email credentials, Cloudinary keys.
4. `npm run start:dev`

## Main route groups
`/auth-user` `/user` `/auth-doctor` `/doctor` `/auth-admin` `/admin` `/MedicalHistory` `/Rating` `/AppointmentFiles
