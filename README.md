# FlowDesk Invoice Management System v0.1

A professional invoice management system built with React 19 and Firebase, featuring customer management, invoice creation, PDF generation, multi-currency support, and business profiles.

🌐 **Live Demo**: [https://flowdesk.tech](https://flowdesk.tech)

## Features

### Core Features
- 🔐 **User Authentication**: Secure login and registration with Firebase Auth
- 👥 **Customer Management**: Add, edit, and manage customer information
- 📄 **Invoice Creation**: Create professional invoices with line items and calculations
- 📊 **Dashboard**: Overview of revenue, pending invoices, and recent activity
- 📑 **PDF Generation**: Download and preview invoices as PDF documents
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

### v0.1 New Features
- 💱 **Multi-Currency Support**: Create invoices in 30+ currencies with proper formatting
- 👔 **Business Profiles**: Manage multiple businesses under one account
- ✉️ **Email in Profiles**: Add business email to profiles for professional invoices
- 🔢 **Flexible Invoice Numbers**: Always editable invoice numbers with auto-increment option
- 🌍 **Custom Domain Support**: Deployed at flowdesk.tech with CORS support
- 🎨 **Enhanced UI**: Improved currency selectors with symbols and better form layouts

## Technologies Used

- **Build Tool**: Vite 6
- **Frontend**: React 19 (RC), Material-UI 6, React Router DOM 7
- **Backend**: Firebase 11 (Firestore, Authentication, Hosting)
- **PDF Generation**: jsPDF with autotable
- **Forms**: React Hook Form
- **Date Handling**: date-fns

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/invoice-management.git
cd invoice-management
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Copy the `.env.example` file to `.env` and add your Firebase configuration:

```bash
cp .env.example .env
```

Then edit `.env` with your Firebase project values:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

### 4. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)

2. Enable the following services:
   - Authentication (Email/Password)
   - Firestore Database
   - Hosting

3. Create a web app in your Firebase project and copy the configuration values to your `.env` file

4. Update `.firebaserc` with your project ID:

```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

### 5. Initialize Firestore

1. Deploy Firestore security rules:
```bash
firebase deploy --only firestore:rules
```

2. Create composite indexes (if needed):
```bash
firebase deploy --only firestore:indexes
```

### 6. Run the Application

```bash
# Development server with hot module replacement
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will open at `http://localhost:3000`

## Deployment

### Deploy to Firebase Hosting

1. Build the production version:
```bash
npm run build
```

2. Deploy to Firebase:
```bash
firebase deploy
```

Your app will be available at `https://your-project-id.web.app`

## Usage Guide

### Getting Started

1. **Register**: Create a new account with your email and password
2. **Complete Profile**: Add your company information in the Profile section
3. **Add Customers**: Navigate to Customers and add your client information
4. **Create Invoice**: Go to Invoices → New Invoice, select a customer, add line items
5. **Manage Invoices**: Track payment status, download PDFs, and manage your invoices

### Invoice Settings

In your profile, you can configure:
- Invoice number prefix
- Default tax rate
- Payment terms
- Company information for invoices

### Features Overview

#### Dashboard
- View total revenue
- Track pending invoices
- See recent invoice activity
- Quick statistics overview

#### Customer Management
- Add new customers with complete contact information
- Edit existing customer details
- Search and filter customers
- Delete customers when needed

#### Invoice Management
- Create professional invoices
- Add multiple line items
- Automatic calculations (subtotal, tax, total)
- Set invoice status (Draft, Pending, Paid, Overdue)
- Download invoices as PDF
- Edit existing invoices

## Project Structure

```
invoice-management/
├── public/
│   └── (static assets)
├── src/
│   ├── components/
│   │   ├── Layout.js
│   │   └── PrivateRoute.js
│   ├── config/
│   │   └── firebase.js
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   ├── Profile.js
│   │   ├── Customers.js
│   │   ├── Invoices.js
│   │   ├── CreateInvoice.js
│   │   └── ViewInvoice.js
│   ├── App.js
│   ├── index.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── firebase.json
├── firestore.rules
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Security

The application implements several security measures:
- Firebase Authentication for user management
- Firestore security rules to protect user data
- Each user can only access their own data
- Input validation on forms
- Secure password requirements

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@invoicemanager.com or open an issue in the GitHub repository.

## Changelog

### v0.1 (September 2025)
- ✅ Added multi-currency support for invoices
- ✅ Implemented business profiles for managing multiple businesses
- ✅ Added email field to business profiles
- ✅ Made invoice numbers always editable
- ✅ Fixed PDF generation to use profile data instead of account data
- ✅ Added currency selector to invoice creation and profile settings
- ✅ Deployed to custom domain with SSL support
- ✅ Enhanced CORS configuration for *.coremaven.tech domains
- ✅ Fixed various UI issues and improved user experience

## Acknowledgments

- Material-UI for the component library
- Firebase for backend services
- jsPDF for PDF generation
- React team for the amazing framework
- Vite for blazing fast development experience
