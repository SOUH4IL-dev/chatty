# Project Changes — Firebase Authentication Migration

## Modified Files

| File | Change |
|------|--------|
| `chati-hna-frontend/src/app/login/page.js` | Replaced custom login with Firebase Email/Password + Google Sign-In + Reset Password |
| `chati-hna-frontend/src/app/register/page.js` | Replaced custom register with Firebase Email/Password + Google Sign-In + Email Verification |
| `chati-hna-frontend/package.json` | Added `firebase` dependency |
| `chati-hna-backand/src/index.js` | Added Firebase Admin SDK initialization |
| `chati-hna-backand/src/controllers/authController.js` | Replaced `register`/`login` with `firebaseAuth` token exchange endpoint |
| `chati-hna-backand/src/routes/authRoutes.js` | Changed routes: removed `/register` + `/login`, added `/firebase` |
| `chati-hna-backand/src/models/User.js` | Added `firebaseUid` field, made `password` optional |
| `chati-hna-backand/package.json` | Added `firebase-admin` dependency |
| `chati-hna-backand/.env` | Added `GOOGLE_APPLICATION_CREDENTIALS` variable |

## Added Files

| File | Purpose |
|------|---------|
| `chati-hna-frontend/src/lib/firebase.js` | Firebase client SDK initialization and export of `auth` + `googleProvider` |

## Removed Code

### Frontend — `login/page.js`
- Removed `api.post('/auth/login', { email, password })` call
- Removed `localStorage.setItem('token', data.token)` / `localStorage.setItem('user', ...)` direct from login
- Removed raw JWT token handling from the login flow

### Frontend — `register/page.js`
- Removed `api.post('/auth/register', { name, email, password })` call
- Removed `localStorage.setItem('token', data.token)` / `localStorage.setItem('user', ...)` direct from register
- Removed raw JWT token handling from the register flow

### Backend — `authRoutes.js`
- Removed `router.post('/register', register)`
- Removed `router.post('/login', login)`

### Backend — `authController.js`
- Removed `register` function (bcrypt password hashing, JWT signing, User.create with hashed password)
- Removed `login` function (bcrypt password comparison, JWT signing)
- Removed `bcryptjs` require

### Backend — `User.js` model
- `password` field no longer required (changed to `default: null`)

## Firebase Integration

### Google Auth
- **Frontend**: `signInWithPopup(auth, googleProvider)` displays the Google OAuth popup. On success, the Firebase ID token is exchanged with the backend for an app JWT. The Google profile name and photo are sent to the backend and stored in MongoDB.
- **Backend**: Firebase Admin SDK verifies the ID token. The `uid`, `email`, `name`, and `picture` from the decoded token are used to create or update the MongoDB user.

### Email/Password Auth
- **Frontend (Login)**: `signInWithEmailAndPassword(auth, email, password)` authenticates against Firebase. Custom error handling maps Firebase error codes (`auth/user-not-found`, `auth/wrong-password`, `auth/invalid-credential`, `auth/too-many-requests`, `auth/user-disabled`) to user-friendly messages.
- **Frontend (Register)**: `createUserWithEmailAndPassword(auth, email, password)` creates a new Firebase account. On success, `sendEmailVerification()` is called. The user's `name` input is sent alongside the ID token to the backend.
- **Backend**: Both flows end at `POST /api/auth/firebase`, which verifies the Firebase ID token via `admin.auth().verifyIdToken(idToken)`, then creates or finds the MongoDB user by `firebaseUid`. An app-level JWT (signed with `JWT_SECRET`, 7-day expiry) is returned.

### Reset Password
- **Frontend (Login page)**: "Forgot Password?" button calls `sendPasswordResetEmail(auth, email)`. A green success banner appears after sending. Errors like `auth/user-not-found` are shown in red. The email field must be filled before clicking.

### Email Verification
- **Frontend (Register page)**: Immediately after `createUserWithEmailAndPassword`, `sendEmailVerification(result.user)` is called. The user is still logged in and redirected to the chat page. Verification status can be checked via `user.emailVerified`.

### Token Verification
- **Backend**: `firebaseAdmin.auth().verifyIdToken(idToken)` decodes and validates the Firebase ID token. This is the single entry point for authentication. The decoded payload contains `uid`, `email`, `name` (for Google), and `picture` (for Google).
- **App JWT**: After Firebase verification, a standard JWT is signed with `JWT_SECRET` containing `{ userId: user._id }`. This JWT is used for all subsequent API calls (chat, contacts, etc.) via the existing `Authorization: Bearer <token>` header.

## Backend Changes

### Firebase Admin SDK initialization (`src/index.js`)
```js
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
```
Uses `GOOGLE_APPLICATION_CREDENTIALS` environment variable pointing to the service account key file.

### New auth endpoint (`src/routes/authRoutes.js`)
- `POST /api/auth/firebase` — accepts `{ idToken, name? }`, verifies with Firebase Admin, creates/updates MongoDB user, returns `{ token, user }`.

### Updated User model (`src/models/User.js`)
- Added `firebaseUid: { type: String, required: true, unique: true }`
- Changed `password` from `required: true` to `default: null` (Firebase handles password storage)

### Auth middleware (`src/middlewares/authMiddleware.js`) — **unchanged**
Still verifies the app JWT (`jsonwebtoken`) sent in `Authorization` headers. This middleware protects all `/api/chat/*` routes and the `/api/auth/update-profile` route.

## Installed Packages

### Frontend
```
firebase@^12.14.0
```

### Backend
```
firebase-admin@^13.10.0
```

### Unused remaining dependency
- `bcryptjs` — no longer imported anywhere but still in `backend/package.json`. Can be removed with `npm uninstall bcryptjs`.

## Environment Variables

### Frontend — `chati-hna-frontend/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCeKq2o8mxcmwPql8Tdp3VHucsgihVHSzA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=chati-hna.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=chati-hna
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=chati-hna.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=170556613940
NEXT_PUBLIC_FIREBASE_APP_ID=1:170556613940:web:56b379672418ced1eff161
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-HNX6Z9BYT2
```

### Backend — `chati-hna-backand/.env`
```
PORT=5000
JWT_SECRET=your_jwt_secret_here
MONGO_URI=mongodb://localhost:27017/chati_hna
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
```

## Remaining Tasks — Firebase Console Configuration

1. **Enable Sign-in methods** — Go to Firebase Console > Authentication > Sign-in method and enable:
   - Email/Password
   - Google

2. **Download Service Account Key** — Firebase Console > Project Settings > Service Accounts > "Generate new private key". Save the downloaded JSON as `chati-hna-backand/serviceAccountKey.json`.

3. **Update Authorized Domains** (if deploying) — Firebase Console > Authentication > Settings > Authorized domains. Add your production domain.

4. **Configure OAuth consent screen** (if using Google Sign-In in production) — Google Cloud Console > APIs & Services > OAuth consent screen.

## Final Result

```
User Action              Frontend (Firebase Client SDK)          Backend (Firebase Admin SDK)
────────────────────────────────────────────────────────────────────────────────────────────
Sign in (Email/Password) → signInWithEmailAndPassword()
                          → getIdToken()
                          → POST /auth/firebase { idToken }     → verifyIdToken(idToken)
                          ← { token, user }                     → findOneOrCreate(firebaseUid)
                          → store token + user in localStorage  → sign app JWT
                          → redirect to /chat

Sign in (Google)         → signInWithPopup(googleProvider)
                          → getIdToken()
                          → POST /auth/firebase { idToken }     → same as above
                          ← { token, user }

Register (Email/Password) → createUserWithEmailAndPassword()
                           → sendEmailVerification()
                           → getIdToken()
                           → POST /auth/firebase { idToken, name }
                           ← { token, user }

Forgot Password          → sendPasswordResetEmail(email)
                           ← success/error toast

All API calls            → axios (Authorization: Bearer <token>) → authMiddleware verifies app JWT
```

The entire auth system now delegates credential management to Firebase. Passwords are never stored in MongoDB. The backend only stores a `firebaseUid` reference, the user's display name, email, and optional profile image. The existing chat infrastructure (socket.io, message CRUD, contacts, calling) continues working unchanged through the same app JWT and auth middleware.
