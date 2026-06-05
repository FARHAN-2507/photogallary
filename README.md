# Photo Gallery

Full-stack photo gallery app with JWT authentication, Cloudinary image hosting, and role-based access.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, TypeScript, React Router 6, Axios |
| Backend | Node.js, Express 4, Mongoose 8, JWT |
| Database | MongoDB Atlas |
| Storage | Cloudinary CDN |

## Features

See [FEATURES.md](./FEATURES.md) for the full list.

## Project Structure

```
├── backend/
│   ├── server.js              # Express entry point
│   ├── config/                # MongoDB + Cloudinary connection
│   ├── middleware/             # Auth guard, admin guard, multer upload
│   ├── models/                # User and Photo schemas
│   └── routes/                # Auth and Photos CRUD
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Router + lazy-loaded routes
│   │   ├── api/               # Axios instance with interceptors
│   │   ├── components/        # Navbar, Loader, PhotoCard, ErrorBoundary
│   │   ├── context/           # AuthContext, LoaderContext
│   │   ├── pages/             # Login, Register, Dashboard, Photos, Upload
│   │   └── utils/             # Format helpers, Cloudinary URL builder
│   └── public/
└── .gitignore
```

## Setup

### 1. Clone and install

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment variables

Create `backend/.env`:

```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
PORT=5000
FRONTEND_URL=http://localhost:3000
MAX_FILE_SIZE=5242880
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_SECRET_KEY=your_admin_key
```

### 3. Run

```bash
# Terminal 1 — Backend
cd backend && npm start

# Terminal 2 — Frontend
cd frontend && npm start
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:5000`. The frontend `package.json` has a `proxy` field that forwards `/api` requests to the backend during development.

### 4. Admin registration

On the Register page, click "+ Admin registration" and enter the `ADMIN_SECRET_KEY` from your `.env`.
