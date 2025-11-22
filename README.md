# 🏥 EHR Frontend (React + Vite)

This is the **frontend application** of the **Electronic Health Record (EHR) Blockchain System**, built using **React + Vite**.  
It provides separate dashboards for **Hospital Admin**, **Doctors**, **Patients**, and **System Admin**, and communicates with the backend (`server-node-sdk`) that interacts with **Hyperledger Fabric**.

---

## 🚀 Features

### 🔐 Authentication & Role Detection
- Login using IDs such as:
  - `hospitalAdmin`
  - `HOSP-01`
  - `DOC-0001`
  - `PAT-00000001`
- Validates ID format before login
- Detects user role automatically
- Blocks inactive/deactivated accounts

### 🏥 Hospital Dashboard
- View hospital-related stats
- Manage doctors & patients (optional)
- Interact with blockchain-fetched data

### 👨‍⚕️ Doctor Dashboard
- View assigned patients
- Add medical records (diagnosis, prescription, file uploads)
- View complete patient history
- File storage via IPFS (Pinata)
- Record timestamps stored on blockchain

### 🧑‍🤝‍🧑 Patient Dashboard
- View personal medical profile
- Grant and revoke doctor access
- View medical history
- Download uploaded medical reports

### 🛡️ Admin Dashboard
- View ledger audit data
- View system allocations (hospitals, doctors, records)
- Analytics based on chaincode stats

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend Framework** | React (Vite) |
| **Styling** | TailwindCSS |
| **Icons** | Lucide Icons |
| **State Management** | React Hooks |
| **HTTP Client** | Axios |
| **Backend** | Node.js (Fabric SDK) |
| **Blockchain** | Hyperledger Fabric Test Network |
| **Storage** | Pinata IPFS |

---

## 📦 Installation & Setup

### 1️⃣ Clone the repository

```sh
$ git clone https://github.com/roystondz/blockchain-frontend.git
$ cd frontend_final
```

### 2️⃣ Install dependencies
```sh
$ npm install
```

### 3️⃣ Start development server
```sh
$ npm run dev
```

### 📁 Folder Structure
```sh
frontend_final/
│── src/
│   ├── components/        # Buttons, Inputs, Navbar, etc.
│   ├── pages/             # Doctor, Patient, Hospital dashboards
│   ├── layouts/           # Dashboard layout
│   ├── utils/             # Helper functions
│   ├── context/           # Axios instance + global config
│   ├── App.jsx
│   └── main.jsx
│
│── public/
│── index.html
│── package.json
│── vite.config.js
└── README.md
```

