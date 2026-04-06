# Marketplace Platform Backend

A production-ready REST API for connecting Brands with Influencers, Athletes, and Players.
Built using Node.js, Express, Firebase (Auth + Firestore), and MVC architecture.

## Getting Started

1. `npm install`
2. Create a `.env` file based on the config. Include your Razorpay credentials and `FIREBASE_SERVICE_ACCOUNT`.
3. Set your valid Firebase Service account to initialize Admin SDK properly in `config/firebase.js`.
4. Run server: `npm run dev`

## API Endpoints List

### Authentication Base (`/api/auth`)
- `POST /register` - Register user in DB with role
- `GET /me` - Get current authenticated user details (Headers: Authorization: Bearer <token>)

### Profiles (`/api/profiles`)
- `POST /talent` - Create/Update Talent Profile
- `POST /brand` - Create/Update Brand Profile
- `GET /:id` - Get ANY profile by userId

### Discovery / Filtering (`/api/discovery`)
- `GET /talents` - Search & filter talent (Query params: category, subCategory, minFollowers, location, etc.)

### Campaigns (`/api/campaigns`)
- `POST /` - Create a new campaign (Brand)
- `GET /` - Get all campaigns
- `POST /:campaignId/apply` - Apply to a campaign (Talent)
- `PATCH /application/:applicationId/status` - Accept/Reject application (Brand)

### Invites (`/api/invites`)
- `POST /` - Send an invite to Talent (Brand)
- `GET /talent` - Get invites for current Talent
- `PATCH /:inviteId/status` - Accept/Reject invite (Talent)

### Chat System (`/api/chat`)
- `POST /` - Send a message
- `GET /:partnerId` - Get chat history

### Payments (`/api/payments`)
- `POST /create-order` - Create a Razorpay Order
- `POST /verify` - Verify Razorpay payment signature

### Reviews (`/api/reviews`)
- `POST /` - Add a review for a talent (Brand)
- `GET /talent/:talentId` - Get all reviews for a talent

### Admin Panel (`/api/admin`) *(Requires Admin Role)*
- `GET /users` - Get all users
- `PATCH /users/:talentId/verify` - Verify a talent profile
- `GET /campaigns` - Monitor all platform campaigns
- `DELETE /users/:userId` - Delete/ban a user
