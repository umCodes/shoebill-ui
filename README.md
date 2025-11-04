## ShoeBill AI — UI

Generate quizzes instantly and study smarter. This is the React + TypeScript UI for ShoeBill AI, featuring quiz creation, history, feedback, PDF export, theming, and PWA support.

### Features
- **Quiz generation & clear-up**: Create quizzes and “clear-up” sheets from content.
- **Question types**: MCQ, True/False, Short Answer, Fill in the Blanks.
- **Answer validation**: Server-side check with explanations.
- **PDF export**: Auto-generated exam papers with answer keys (jsPDF + autotable).
- **Auth & profile**: Sign up, log in, and session-aware UI.
- **History**: Browse previous quizzes.
- **Feedback**: Send feedback from within the app.
- **Theming**: Light/dark mode via Chakra UI with a Tailwind utility layer.
- **PWA**: Installable app with offline caching for API routes.

### Tech Stack
- **React 19**, **TypeScript**, **Vite 7**
- **Chakra UI** for components and theming
- **Tailwind (via @tailwindcss/vite)** for utilities
- **React Router 7** for routing
- **Axios** for API calls
- **vite-plugin-pwa** for PWA features
- **jsPDF + jspdf-autotable** for PDF generation

### Getting Started
1. **Prerequisites**
   - Node.js 18+ and npm
2. **Install dependencies**
   ```bash
   git clone https://github.com/umCodes/shoebill-ui 
   npm install
   ```
3. **Environment variables**
   Copy `.env.example` to `.env` (or `.env.local`) and adjust values:
   ```bash
   cp .env.sample .env
   # then edit .env
   ```
   Variables:
   ```bash
   VITE_BASE_API_PATH=https://your-api-host
   ```
   - Used by services under `src/services` (e.g., `auth.services.ts`, `quiz.services.ts`).
4. **Run the dev server**
   ```bash
   npm run dev
   ```
   - App runs on the Vite dev server. HMR enabled.

### Available Scripts
- `npm run dev`: Start Vite dev server
- `npm run build`: Type-check (tsc -b) and build for production
- `npm run preview`: Preview the production build locally
- `npm run lint`: Run ESLint

### Project Structure
```
src/
  components/ui/        # Theme, color mode, shared UI primitives
  contexts/             # Auth, Lab, Quizzes React contexts
  layout/               # Header, Main layout
  pages/                # Home, Lab, Quiz, History, Feedback, Auth
  providers/            # Context providers
  services/             # axios calls to API (uses VITE_BASE_API_PATH)
  types/                # TypeScript types (quiz, user)
  ui/                   # App-specific reusable components
  utils/                # pdf generation utilities
  router.tsx            # Route definitions (React Router v7)
  main.tsx, App.tsx     # App bootstrap
```

### Routing
Defined in `src/router.tsx`:
- `/` Home
- `/lab` Create quizzes / clear-ups
- `/history` Past quizzes
- `/feedback` Feedback form
- `/register`, `/login` Auth
- `/quiz/:id` Quiz detail/view

### PWA
- Configured in `vite.config.ts` with `vite-plugin-pwa`.
- Manifest name: "ShoeBill AI"; icon: `public/logo.png`.
- Runtime caching example for `/api/(quiz|quizzes)` with `CacheFirst`.
- Title and splash handled in `index.html`.

### Theming
- Chakra UI provides the design system and color mode.
- Tailwind utilities are available via `@tailwindcss/vite` and imported in `src/index.css`.

### PDF Export
- See `src/utils/pdf.tsx` for exam paper generation with answer keys, branding, and pagination.

### Environment & API
- All API calls use `VITE_BASE_API_PATH` and `withCredentials: true` for auth/session.
- Endpoints used (examples):
  - `POST /auth/signup`, `POST /auth/login`, `DELETE /auth/logout`, `GET /user`
  - `POST /api/quiz`, `POST /api/clearup`, `GET /api/quizzes`, `GET /api/quiz`, `DELETE /api/quiz`, `POST /api/check`

### Deployment
1. Build the app:
   ```bash
   npm run build
   ```
2. Serve the `dist/` directory with any static host.
3. Ensure `VITE_BASE_API_PATH` points to your production API and that CORS/credentials settings permit your app origin.

### License
Proprietary — All rights reserved unless otherwise stated.

