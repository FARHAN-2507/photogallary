# Photo Gallery — Features

## Frontend

| Feature | Description | Impact |
|---------|-------------|--------|
| JWT Auth (Login/Register) | Form-based auth with client-side validation, error handling | Secure access control |
| Protected Routes | `ProtectedRoute` wrapper redirects unauthenticated users to `/login` | Prevents unauthorized page access |
| Role-aware UI | Navbar + Dashboard adapt content for `user` vs `admin` roles | Tailored experience per role |
| Photo Grid | Responsive CSS Grid with lazy-loaded images, hover effects | Fast visual browsing |
| Lightbox Preview | Click-to-open full-size image overlay with close on backdrop click | Immersive viewing without navigation |
| Pagination | Previous/Next buttons, page counter, scroll-to-top on change | Handles large galleries efficiently |
| Upload with Progress | Drag-and-drop zone, file type/size validation, real-time upload % bar | Clear feedback during uploads |
| Image Optimization | Cloudinary `w_400,q_auto,f_auto` transforms on grid thumbnails | ~90% bandwidth reduction vs full-size originals |
| Code Splitting | `React.lazy` + `Suspense` per page — separate JS chunks loaded on demand | ~60% smaller initial bundle, faster first paint |
| Global API Loader | Axios interceptor-driven full-screen overlay during all API calls | Consistent loading UX, no per-component spinners |
| Error Boundary | Catches runtime errors, shows "Something went wrong" with reload button | Prevents white-screen crashes |
| Auth Bootstrap | Reads token/user from `localStorage` on mount, instant session restore | No flash of login for returning users |
| Memoized PhotoCard | `React.memo` prevents re-render of unchanged photo cards | Smoother pagination and delete operations |
| Utility Extraction | `formatSize`, `formatDate`, `getOptimizedUrl` as pure module-level functions | Functions defined once, not recreated per render |

## Backend

| Feature | Description | Impact |
|---------|-------------|--------|
| JWT Authentication | `jsonwebtoken` with 7-day expiry, Bearer token flow | Stateless, scalable auth |
| Password Hashing | bcryptjs with salt round 12 on User pre-save hook | Strong password storage |
| Role-based Auth | `user` / `admin` roles checked via middleware on routes | Granular permission control |
| Admin Registration | Secret key (`ADMIN_SECRET_KEY`) gates admin account creation | Prevents unauthorized admin escalation |
| Photo CRUD | Upload (Cloudinary + MongoDB), list (paginated), delete (with Cloudinary cleanup) | Full lifecycle management |
| Cloudinary Integration | Auto-transformation (max 1920x1920, auto quality), CDN delivery | Optimized image storage and delivery |
| Rate Limiting | Auth routes: 10 req/15min, API routes: 100 req/15min | Brute-force and abuse prevention |
| Security Headers | `helmet` — sets CSP, X-Frame-Options, XSS filter, etc. | Protection against common web attacks |
| Input Validation | `express-validator` on all routes — type, length, format checks | Prevents malformed/malicious input |
| MongoDB Indexing | Compound index on `{userId, createdAt}` for photo queries | Fast paginated queries at scale |
| Photo Count Limit | Hard cap of 100 photos per user, enforced server-side | Prevents storage abuse |
| Error Handling | Multer errors, validation errors, JWT errors, 404, 500 — all handled | Graceful failure at every layer |
| CORS Whitelist | Configurable `FRONTEND_URL` restricts API access to known origins | Prevents cross-origin abuse |
| 401 Auto-cleanup | Expired/invalid tokens on the frontend trigger logout + redirect | Seamless re-authentication flow |
