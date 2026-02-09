# 🏥 EHR System - Blockchain-Powered Healthcare Management

A modern, enterprise-grade Electronic Health Record (EHR) system built with React and secured by Hyperledger Fabric blockchain technology. Features comprehensive emergency access management, role-based dashboards, and real-time medical record sharing.

## ✨ Key Features

### 🚨 **Emergency Access Management**
- **Emergency Request System** - Doctors can request immediate patient access in critical situations
- **Emergency Modal Interface** - Urgent, visually striking request forms with detailed patient information
- **Admin Approval Workflow** - Three-tier review system (Pending/Approved/Rejected)
- **Real-time Status Tracking** - Live updates on emergency request decisions
- **Audit Trail** - Complete logging of all emergency access requests

### 🚀 **Advanced User Experience**
- **Smart Search** - Intelligent autocomplete with keyboard navigation
- **Real-time Notifications** - Live system alerts and updates
- **Professional UI Components** - Modern, responsive design
- **Role-based Dashboards** - Tailored interfaces for each user type
- **Smooth Animations** - Polished transitions and micro-interactions

### 🔒 **Blockchain Security**
- **Hyperledger Fabric Integration** - Enterprise-grade security
- **Immutable Medical Records** - Tamper-proof data storage
- **Cryptographic Protection** - End-to-end encryption
- **Audit Trail** - Complete transaction history
- **Smart Contracts** - Automated compliance

### 📊 **Comprehensive Management**
- **Multi-Role System** - Admin, Hospital, Doctor, Patient portals
- **Real-time Analytics** - Live system metrics and insights
- **Advanced Filtering** - Powerful data search capabilities
- **Professional Reporting** - Detailed medical and administrative reports
- **Mobile Responsive** - Works seamlessly on all devices

## 🏗️ Architecture

### **Frontend Stack**
```
React 18+          - Modern UI framework
TailwindCSS        - Utility-first styling
Lucide Icons       - Beautiful icon library
React Router       - Client-side routing
React Hot Toast    - Notification system
```

### **Backend Integration**
```
Hyperledger Fabric - Blockchain network
REST API          - Data communication
IPFS              - Distributed file storage
MongoDB           - Database management
```

## 🎯 User Roles & Features

### 🛡️ **Administrator Dashboard**
- **System Overview** - Real-time metrics and health monitoring
- **Hospital Management** - Register and manage healthcare facilities
- **Emergency Request Management** - Review and approve/reject emergency access requests
- **Three-Tier Emergency Review** - Pending/Approved/Rejected request tracking
- **User Administration** - Manage doctors and patient access
- **Blockchain Explorer** - View distributed ledger data
- **Analytics & Reports** - Comprehensive system insights

### 🏥 **Hospital Dashboard**
- **Doctor Registration** - Add medical staff to the system
- **Patient Management** - Register and manage patient records
- **Medical Records** - Create and update patient health data
- **Appointment Scheduling** - Manage doctor-patient appointments
- **Billing & Insurance** - Handle financial operations

### 👨‍⚕️ **Doctor Dashboard**
- **Patient Records** - Access and update medical histories
- **Emergency Access Requests** - Request immediate access to critical patient data
- **Emergency Modal System** - Visually striking emergency request interface
- **Prescription Management** - Digital prescription system
- **Lab Results** - View and analyze diagnostic data
- **Patient Communication** - Secure messaging system
- **Schedule Management** - Calendar and appointment tools

### 👤 **Patient Dashboard**
- **Medical History** - Complete health record access
- **Appointment Booking** - Schedule with healthcare providers
- **Prescription Access** - View current and past medications
- **Lab Results** - Access diagnostic reports
- **Insurance Information** - Manage coverage and claims

## 🚀 Getting Started

### **Prerequisites**
- Node.js 16+ 
- npm or yarn
- Git
- Hyperledger Fabric (for blockchain features)
- MongoDB (for data storage)
- IPFS (for distributed file storage)

### **Installation**
```bash
# Clone the repository
git clone https://github.com/roystondz/blockchain-frontend.git
cd blockchain-frontend

# Install dependencies
npm install

# Start development server
npm start
```

### **Environment Setup**
```bash
# Create environment file
cp .env.example .env

# Configure your API endpoints
REACT_APP_API_URL=http://localhost:5000
REACT_APP_BLOCKCHAIN_URL=http://localhost:7051
REACT_APP_IPFS_URL=http://localhost:5001
REACT_APP_MONGODB_URI=mongodb://localhost:27017/ehr-system
```

### **Backend Setup**
```bash
# Start backend server (required for API endpoints)
cd ../backend
npm install
npm run dev

# Start blockchain network
./startBlockchain.sh

# Start IPFS node
ipfs daemon
```

## 📱 Sample Login Credentials

### **Administrator**
```
User ID: hospitalAdmin
Password: [Your Password]
```

### **Hospital**
```
User ID: HOSP-01
Password: [Your Password]
```

### **Doctor**
```
User ID: DOC-0001
Password: [Your Password]
```

### **Patient**
```
User ID: PAT-00000001
Password: [Your Password]
```

## 🎨 UI Components

### **Emergency Components**
- **EmergencyModal** - Urgent, visually striking emergency access request interface
- **EmergencyRequestCard** - Display emergency request details with status indicators
- **EmergencyStatusBadge** - Color-coded status indicators (Pending/Approved/Rejected)

### **Professional Cards**
- **StatsCard** - Animated metric displays
- **BlockchainCard** - Security status indicators
- **ActivityCard** - Recent activity feeds
- **ProfessionalCard** - Versatile content containers

### **Enhanced UX Components**
- **SmartSearch** - Intelligent search with autocomplete
- **NotificationBell** - Real-time alert system
- **UserMenu** - Profile and settings management
- **QuickFilters** - Advanced filtering options
- **Breadcrumb** - Navigation trail

### **Form Components**
- **FormField** - Enhanced input fields with validation
- **SelectField** - Dropdown menus with search
- **TextArea** - Rich text input areas
- **Checkbox** - Custom checkbox components
- **RadioGroup** - Radio button groups

## 🔧 Development

### **Project Structure**
```
src/
├── components/          # Reusable UI components
│   ├── EmergencyModal.jsx
│   ├── ProfessionalCard.jsx
│   ├── EnhancedUX.jsx
│   ├── FormComponents.jsx
│   └── ...
├── pages/               # Main application pages
│   ├── AdminDashboard.jsx
│   ├── HospitalDashboard.jsx
│   ├── DoctorDashboard.jsx
│   └── PatientDashboard.jsx
├── layouts/             # Layout components
├── utils/               # Utility functions
├── context/             # React context providers
└── assets/              # Static assets
```

### **API Integration**
```javascript
// Emergency Access APIs
GET /emergency/requests?status=PENDING&userId=HOSP-01
GET /emergency/requests?status=APPROVED&userId=HOSP-01
GET /emergency/requests?status=REJECTED&userId=HOSP-01
POST /admin/emergency/requests (legacy pending requests)

// Doctor APIs
GET /doctor/emergency/my-access
POST /doctor/emergency/request
POST /doctor/checkAccess
POST /doctor/requestAccess

// Admin APIs
POST /admin/emergency/decision
POST /getSystemStats
```

### **State Management**
- **React Hooks** - useState, useEffect, useCallback
- **Context API** - Global state management
- **Local State** - Component-level state management
- **API State** - Async data fetching patterns

### **Available Scripts**
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run lint       # Run ESLint
```

## 🔒 Security Features

### **Blockchain Integration**
- **Immutable Records** - Medical data cannot be altered
- **Cryptographic Security** - AES-256 encryption
- **Smart Contracts** - Automated compliance checks
- **Audit Trail** - Complete transaction history
- **Consensus Mechanism** - Multi-party validation

### **Data Protection**
- **End-to-End Encryption** - Secure data transmission
- **Role-Based Access** - Granular permission control
- **Session Management** - Secure user sessions
- **API Security** - JWT authentication
- **Input Validation** - Comprehensive data sanitization

## 📊 System Monitoring

### **Real-time Metrics**
- **User Activity** - Active sessions and engagement
- **System Performance** - Response times and uptime
- **Database Health** - Storage and query performance
- **Blockchain Status** - Network and node monitoring
- **Security Alerts** - Suspicious activity detection

### **Analytics Dashboard**
- **User Growth** - Registration trends
- **Usage Patterns** - Feature adoption metrics
- **Performance Analytics** - System optimization insights
- **Compliance Reports** - Regulatory compliance tracking
- **Financial Metrics** - Revenue and cost analysis

## 🌟 Recent Updates

### **Version 2.1 Features**
- 🚨 **Emergency Access System** - Complete emergency request workflow
- 📋 **Emergency Modal Interface** - Visually striking emergency request forms
- 🔄 **Three-Tier Review System** - Pending/Approved/Rejected request management
- ⚡ **Real-time Status Updates** - Live emergency request tracking
- 🎯 **Enhanced Admin Dashboard** - Improved emergency request management
- 📊 **Dual API Integration** - Support for legacy and new emergency endpoints

### **Version 2.0 Features**
- ✨ **Enhanced UX Components** - Modern, intuitive interface
- 🎨 **Professional Design System** - Consistent visual language
- ⚡ **Performance Optimizations** - Faster load times
- 📱 **Mobile Improvements** - Better responsive design
- 🔔 **Advanced Notifications** - Real-time alert system
- 🎯 **Smart Search** - Intelligent autocomplete
- 📊 **Live Analytics** - Real-time system metrics
- 🏆 **Achievement System** - Gamified user engagement

### **Technical Improvements**
- **Code Refactoring** - Cleaner, more maintainable code
- **Component Library** - Reusable UI components
- **Error Handling** - Better error management
- **Loading States** - Improved user feedback
- **Accessibility** - WCAG compliance improvements
- **Testing Coverage** - Comprehensive test suite
- **API Optimization** - Efficient data fetching patterns

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Development Guidelines**
- Follow the existing code style
- Add tests for new features
- Update documentation
- Ensure accessibility compliance
- Test on multiple devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Email**: roystonad2004@gmail.com
- **Documentation**: [Wiki](https://github.com/roystondz/blockchain-frontend/wiki)
- **Issues**: [GitHub Issues](https://github.com/roystondz/blockchain-frontend/issues)

## 🌟 Acknowledgments

- **Hyperledger Fabric** - Blockchain infrastructure
- **React Team** - Frontend framework
- **TailwindCSS** - Utility-first CSS framework
- **Lucide** - Beautiful icon library
- **Healthcare Professionals** - Domain expertise and feedback

---

**Built with ❤️ for the healthcare community** 🏥⚕️👨‍⚕️👩‍⚕️👨‍⚕️👩‍⚕️

