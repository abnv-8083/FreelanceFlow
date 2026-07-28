# ⚡ FreelanceFlow - Modern Client CRM & Freelancer Workspace

FreelanceFlow is a modern, high-performance Client Relationship Management (CRM) and Freelancer Business Workspace built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **Express**, **MongoDB Atlas**, **Google Gemini AI**, and **Nodemailer**.

---

## 🌟 Key Features

### 👤 Role-Based Authentication & User Management
- **Role Switch Tabs**: Separate authentication portals for **Freelancers** and **Admins**.
- **Admin Freelancer Dispatch**: Admins create freelancer accounts; credentials are dispatched automatically via dark-mode Nodemailer HTML emails.
- **Password Reset Queue**: Freelancers can submit password reset requests (with desired passwords & notes) to the Admin queue for approval.

### 💼 Client CRM Directory & Mandatory Field Telemetry
- **Strict Validation**: Enforces **Name**, **Phone Number**, and **Status** as mandatory fields.
- **Client Records**: Track contact details, tax ID, preferred currency (INR ₹), company name, and notes.

### 📊 Sales Pipeline & Kanban Board
- Track deal stages (*New Lead*, *Contacted*, *Discussion*, *Proposal*, *Negotiation*, *Won*, *Lost*).
- **Top Horizontal Scrollbar**: Top-positioned horizontal scrollbars for smooth Kanban navigation.
- 1-click **Convert Lead to Active Client CRM**.

### 📁 Projects & Embedded Tasks Suite
- Projects track budgets in **₹ INR**, deadlines, progress percentages, and health indicators (*On Track*, *At Risk*).
- **Embedded Tasks & Views**: Selecting a project opens its dedicated task suite with **Kanban Board**, **List View**, and **Calendar Schedule** views.

### 🤖 FlowAI Copilot (Google Gemini 3.6 Flash Integration)
- Live AI Assistant powered by Google Gemini `gemini-3.6-flash`.
- Generates proposal text, client communication emails, and project timeline estimates.

### 🧾 Invoices, Contracts & Business Analytics
- Interactive Invoice builder with print/PDF support.
- Real-time monthly revenue trajectory area charts.

---

## 🛠️ Technology Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons, Framer Motion
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB Atlas (with automated Node SRV DNS fallbacks)
- **AI Engine**: Google Gemini API (`gemini-3.6-flash`)
- **Email Service**: Nodemailer (Gmail App Passwords)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ 
- **npm**: v9+

### Environment Setup
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/freelanceflow?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### Installation
```bash
# Install dependencies
npm install

# Run Frontend & Backend concurrently in development
npm run dev:all
```

### Production Build & Server
```bash
# Build Vite production assets
npm run build

# Start single-port production full-stack app
npm start
```

---

## 📜 License
MIT License. Created for Freelancers & Agency Studios.
