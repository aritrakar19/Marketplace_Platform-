# Marketplace Platform Architecture Review & Final Code Structure

This document outlines the optimized full-stack architecture for the Marketplace Web Application, covering the backend structure, Firebase integration, the Role-Based authentication flow, middleware implementation, and REST API conventions. All security implications, environment variables usage, and module breakdowns are implemented to remain highly scalable and maintainable.

## 1. Final Optimized Folder Structure

### Backend (Node.js/Express)
The backend conforms precisely to a domain/feature-based MVC (Controller-Service-Route-Validator) architecture.
```text
backend/
├── config/
│   └── firebase.js          # Secure initialization using Process.env variables
├── middleware/
│   ├── auth.middleware.js   # Verifies Firebase JWT Context
│   ├── role.middleware.js   # Protects endpoints per-role (Talents, Brands, Admins)
│   ├── error.middleware.js  # Global error handling
│   └── validate.middleware.js # Express payload validator middleware
├── modules/
│   ├── admin/               # Admin management endpoints
│   ├── applications/        # Talent campaign applications
│   ├── auth/                # Dedicated registration & onboarding (e.g. role selection)
│       ├── auth.controller.js
│       ├── auth.routes.js
│       ├── auth.service.js
│       └── auth.validator.js
│   ├── brands/              # Brand profile schemas & workflows
│   ├── campaigns/           # Marketplace listings & discoverable jobs
│   ├── chat/                # Real-time message APIs syncing w/ Firebase
│   ├── invites/             # Invitations from Brands targeting Talents
│   ├── payments/            # Integrated payment tracking structures
│   ├── reviews/             # Brand-Talent rating feedback
│   ├── talents/             # Influencer/Athlete profiles
│   └── users/               # Base User data & unified functions
├── routes/
│   └── index.js             # Centralized routing registry map
├── utils/
│   ├── response.js          # Uniform JSON responder
│   └── logger.js            # General logging utility
├── .env                     # Secrète variables block (API keys excluded from git)
├── app.js                   # Application bootstrap & globals setup
├── package.json
└── server.js                # Port listening init logic
```

### Frontend (React/Vite)
Features are cleanly divided between UI presentation and state/services layout. Feature grouping enforces separation of concerns.
```text
frontend/
├── src/
│   ├── app/
│   │   ├── App.tsx          # Main entry tree
│   │   ├── routes.tsx       # React-Router with Route protection Wrappers 
│   │   └── pages/           # Views (e.g., AuthPage, BrandDashboard, ExploreTalent)
│   ├── components/
│   │   ├── common/          # Reusable shared components (Buttons, Loaders)
│   │   ├── layout/          # Global layouts (Sidebars, Navbars)
│   │   └── ui/              # Base Atomic design UI specifics
│   ├── context/             # Global Contexts (AuthContext storing DB fetched role)
│   ├── hooks/               # Custom hooks (e.g. `useRole()`, `useAuth()`)
│   ├── services/
│   │   ├── firebase.ts      # Core Firebase connection (Client-side usage)
│   │   └── api.js           # Base Axios/Fetch instance 
│   ├── styles/              # Global CSS / Theme config
│   └── utils/               # Transformation / String helpers
├── .env                     # Client prefixes (VITE_FIREBASE_)
├── index.html
├── package.json
└── vite.config.ts
```

---

## 2. Firebase Config Setup (`.env`)

Never expose API keys to GitHub or client-bundles inappropriately.

**Backend `.env`**
```env
PORT=5000
NODE_ENV=development

# Dedicated Secure Firebase Admin Keys
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----"

# Providers
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**Frontend `.env`**
```env
# Exposed client-facing tracking & auth keys (Safe to expose)
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Backend `config/firebase.js` mapping example:**
```javascript
const admin = require('firebase-admin');
require('dotenv').config();

let db;
try {
  let credential;
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Converts \n string characters back to actual new lines
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
  }

  admin.initializeApp({
    credential: credential || admin.credential.applicationDefault()
  });

  db = admin.firestore();
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

module.exports = { admin, db };
```

---

## 3. Auth Flow Explanation

1. **Signup/Login Form (Frontend)** 
   - User signs up through `firebase/auth`. On First-time signup, the frontend prompts user to select a role (`[Talent, Brand]`). 
2. **Registration API (Backend)**
   - The React app hits `/api/auth/register` with the role type and Firebase `uid`. The backend creates a mirrored `Users` document in Firestore storing `{ role, email, createdAt }`.
3. **Session Verification**
   - On successful login, the frontend passes `await auth.currentUser.getIdToken()` to the backend in the `Authorization: Bearer <TOKEN>` header.
4. **Context Update & Redirection**
   - Upon verification via `<AuthContext>`, user role is stored locally.
   - Using protected routes (`routes.tsx`), dynamic relocation is enforced: `Talent Dashboard`, `Brand Dashboard`, or `Admin Panel`.

---

## 4. Example Middlewares

### `auth.middleware.js` (Verify Firebase Token)
```javascript
const { admin, db } = require('../config/firebase');
const { error } = require('../utils/response');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'No token provided', 401);
  }

  try {
    const token = authHeader.split(' ')[1];
    req.user = await admin.auth().verifyIdToken(token); // Verify validity + expiry
    
    // Supplement context with database role
    const userDoc = await db.collection('Users').doc(req.user.uid).get();
    if (userDoc.exists) req.user.role = userDoc.data().role;
    
    next();
  } catch (err) {
    return error(res, 'Invalid token', 401);
  }
};

module.exports = { verifyToken };
```

### `role.middleware.js` (Enforce RBAC Permissions)
```javascript
const { error } = require('../utils/response');

// Pass spread arguments (e.g., restrictTo('Brand', 'Admin'))
const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return error(res, 'Permission denied. Unqualified Role.', 403);
  }
  next();
};

module.exports = { restrictTo };
```

---

## 5. API Structure Mapping

Utilizing central tracking (`routes/index.js`), these feature domains separate nicely: 

### Auth & Onboarding
- `POST /api/auth/register` → Setup Role and base attributes.
- `GET /api/auth/me` → Secure retrieval of user metadata.

### Talent Profile APIs
- `GET /api/talents/discovery` → Fetch filters (categories, metrics). *(Public/Brand View)*
- `PUT /api/talents/profile` → Update influencer meta (Instagram API links, Pricing). *(Talent Only)*

### Campaign Workflows
- `POST /api/campaigns` → Brand creates a new job. *(Brand Only)*
- `GET /api/campaigns` → Lists applicable jobs for talents. *(Talent View)*
- `POST /api/applications/:campaign_id` → Talent applies or connects. *(Talent Only)*

### System Integration
- `POST /api/payments/intent` → Generate Razorpay intent. *(Brand Only)*
- `GET /api/chat/history/:room` → Fetch messages securely validated against campaign agreements.
