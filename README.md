# Dynamic Full-Stack Portfolio & Admin Panel

A premium, modern, and highly interactive full-stack personal portfolio website paired with a comprehensive admin control panel. Built with **React (Vite)** on the frontend and **Node.js (Express)** + **MongoDB** on the backend.

---

## 🏗️ Project Architecture

The project is split into two main parts:

1. **`frontend/`** — React SPA with Vite, tailored with smooth animations, custom CSS styling, and dynamic data fetching. Contains:
   - **User Portfolio**: Hero, About, Services, Projects, Testimonials, and Contact form.
   - **Admin Panel (`/admin`)**: A secure dashboard for full CRUD management of services, projects, testimonials, and site-wide metadata.
2. **`backend/`** — Express REST API with MongoDB (Mongoose) handling database models, file uploads, JWT authentication, and automated email alerts.

---

## ✨ Features

- 👤 **Dynamic Content**: All portfolio sections (Hero, Services, Projects, Testimonials) are populated dynamically from the database.
- 🔐 **Secure Admin Login**: Password hashing (bcrypt) and token-based (JWT) auth protect dashboard routes.
- 🛠️ **Admin Dashboard**:
  - Full CRUD operations for Projects, Services, and Testimonials.
  - Profile customization & general site settings management.
  - Built-in **image cropper** (`react-easy-crop`) for standardizing project and profile images.
- 📧 **Instant Contact Notifications**: Submissions on the contact form (including Name, Email, Phone, and Message) are automatically saved to MongoDB and forwarded to your Gmail inbox via SMTP.
- 🖼️ **Asset Management**: Seamless file uploading and storage handled by Multer.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** (running locally or a MongoDB Atlas URI)

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create and configure your environment variables:
   Copy `.env.example` to a new file named `.env` and fill in the values:
   ```env
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/portfolio
   JWT_SECRET=your_jwt_secret_here

   # Initial Admin Credentials (seeded on first run)
   ADMIN_EMAIL=your-email@example.com
   ADMIN_PASSWORD=your-secure-password
   ADMIN_NAME=Admin

   # Email Notification Settings (SMTP)
   SMTP_USER=buildwithrabeeh@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx  # Google App Password
   NOTIFY_EMAIL=buildwithrabeeh@gmail.com
   ```
   > 💡 **SMTP Tip**: For Gmail, enable 2-Step Verification on your account, then generate a 16-character **App Password** to put in `SMTP_PASS`.

4. Start the backend server:
   - **Development Mode** (with auto-reload):
     ```bash
     npm run dev
     ```
   - **Production Mode**:
     ```bash
     npm start
     ```

---

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will run at **`http://localhost:3000`**.

4. **Production Build**:
   ```bash
   npm run build
   ```
   This generates static production files in the `/dist` directory.

---

## 🛠️ Development & Proxy Config

To avoid CORS issues, Vite is pre-configured in `vite.config.js` to proxy frontend API requests directly to the backend:

- All `/api/*` endpoints proxy to `http://localhost:5001/api/*`
- All `/uploads/*` image files proxy to `http://localhost:5001/uploads/*`
