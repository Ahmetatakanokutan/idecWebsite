# Gemini Project Context: IDEC-TT Frontend

## Project Overview

This project is a modern frontend web application for the "IDEC-TT Decarbonization Project". It serves as an informational website and educational platform, providing details on sustainability projects, online courses (IDEC Akademi), and contact information. The application is built with **React** and **TypeScript**, using **Vite** as the build tool.

A key external feature is the integration of **KarbonBot**, an AI assistant from `knowhy.info`, which is embedded directly into the `index.html` file.

### Architecture

The application was recently refactored from a single-file prototype into a scalable, feature-based architecture.

*   **`src/pages`**: Contains the top-level components for each page (e.g., `HomePage`, `ProjectsPage`).
*   **`src/components`**: Holds reusable components shared across pages, such as `Header`, `Footer`, and a main `Layout` component that provides a consistent structure.
*   **`src/data`**: Isolates static mock data. Currently, it holds data for `courses` and `projects`.
*   **`src/routes`**: A central file (`index.tsx`) defines all client-side routes using `react-router-dom`, mapping URL paths to their corresponding page components.
*   **`App.tsx`**: The main application component, which serves as the entry point for the router.
*   **`main.tsx`**: The application's main entry point, which renders the React app and wraps it in `BrowserRouter` to enable routing.

### Key Technologies

*   **Framework:** React 18
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **Routing:** `react-router-dom`
*   **Styling:** Tailwind CSS
*   **Icons:** `lucide-react`

## Building and Running

### 1. Install Dependencies

To install all the necessary libraries and packages defined in `package.json`, run:

```bash
npm install
```
> **Note:** On some Windows systems with strict PowerShell policies, you may need to use `npm.cmd install`.

### 2. Run the Development Server

To start the local development server, run:

```bash
npm run dev
```
The application will typically be available at `http://localhost:5173`. The server supports Hot Module Replacement (HMR), so changes in the code will be reflected in the browser instantly.

### 3. Build for Production

To create an optimized production build, run:

```bash
npm run build
```
This command will generate a `dist` directory containing the static assets for deployment.

### 4. Code Quality

To check the code for linting errors, run:

```bash
npm run lint
```

## Development Conventions

*   **Component-Based Structure:** The application is built around React functional components.
*   **Styling:** All styling is done using Tailwind CSS utility classes directly within the JSX of the components.
*   **Routing:** All pages are managed via `react-router-dom`. New pages should be added to `src/pages` and registered in `src/routes/index.tsx`.
*   **Data Management:** Static data is kept separate in the `src/data` directory. For now, the application does not have a global state management library (like Redux or Zustand) and relies on component-level state (`useState`).
*   **Authentication:** The `CourseDetailPage` is prepared for authentication. It contains a hardcoded `isLoggedIn` flag that conditionally renders either a "locked" view or the course content. This is intended to be replaced with a real authentication mechanism (e.g., from a backend service like Spring Security).

---

## Recent Modifications by Gemini (14 Kasım 2025 Cuma)

This section summarizes the changes made to the project to establish and refine the authentication flow and user interface.

### New Additions

*   **Frontend Authentication System:** A comprehensive authentication system was implemented for the frontend using React's Context API.
    *   **`src/context/AuthContext.tsx`:** A new file was created to manage the global authentication state, including tracking if a user is `isLoggedIn`, their `roles`, and providing `login` and `logout` functionalities. This context utilizes `jwt-decode` to parse JWT tokens stored in `localStorage`.
    *   **`jwt-decode` library:** Added as a frontend dependency. This library is crucial for safely decoding JSON Web Tokens (JWTs) received from the backend.
    *   **`@headlessui/react` library:** Added as a frontend dependency. This library provides unstyled, accessible UI components, specifically used here to create a sophisticated dropdown menu for user profiles in the header.

### Backend Enhancements

*   **JWT Role Inclusion:** The backend's JWT generation process was updated to embed user roles directly into the JWT token's claims.
    *   **`backend/IdecTTBackend/src/main/java/com/example/idectt/security/jwt/JwtUtils.java`:** Modified to include user authorities (roles) as a custom claim named "roles" within the generated JWT token. This ensures the frontend receives necessary authorization information.
*   **Improved Authentication Error Handling:** The backend's response for authentication failures was refined to provide structured error messages.
    *   **`backend/IdecTTBackend/src/main/java/com/example/idectt/security/jwt/AuthEntryPointJwt.java`:** Updated to return a JSON-formatted error response (HTTP `401 Unauthorized` with a JSON body containing `status`, `error`, `message`, and `path` details) instead of a plain text message. This significantly improves the frontend's ability to parse and display meaningful error feedback.

### Frontend Component Modifications

*   **`src/main.tsx`:** The application's main entry point was updated to wrap the entire `App` component with the newly created `AuthProvider`. This makes the authentication context and state accessible throughout the entire frontend application.
*   **`src/pages/LoginPage.tsx`:** The login page component was refactored to integrate with the new authentication context.
    *   It now utilizes the `login` function provided by `AuthContext` to handle successful authentication, centralizing the login logic.
    *   The component was also enhanced to correctly parse and display detailed error messages received from the backend.
*   **`src/components/Header.tsx`:** The application's header component underwent significant refactoring to dynamically reflect the user's authentication status.
    *   The static "Giriş Yap" (Login) button was replaced with conditional rendering logic.
    *   When a user is logged in, a profile icon (`UserCircle`) is displayed. Clicking this icon now triggers a new, accessible dropdown menu (powered by `@headlessui/react`). This dropdown proudly displays the user's assigned roles and provides a "Çıkış Yap" (Logout) option.
    *   The component was made more robust by adding checks to ensure the `roles` array exists before attempting to display it, preventing potential UI crashes.

---

## Dynamic Content Migration & Bug Fixes (18 Kasım 2025 Salı)

This section details a major refactoring effort to move static content to the backend, making the "IDEC Akademi" and "Projeler" sections fully dynamic. It also covers critical bug fixes in the backend and frontend.

### Backend Enhancements

*   **Dynamic Course & Project Management:** The static, hardcoded data for courses and projects was migrated to a dynamic, database-driven system.
    *   **New JPA Entities:** Created `Course.java`, `Lesson.java`, `Instructor.java`, and `Project.java` to model the data structures in the database.
    *   **New Repositories:** Implemented Spring Data JPA repositories (`CourseRepository`, `LessonRepository`, etc.) for database operations.
    *   **New DTOs:** Created various Data Transfer Objects (`CourseDetailDto`, `ProjectDto`, etc.) to ensure clean data transfer to the frontend.
    *   **Data Seeding:** The `DataInitializer.java` was significantly enhanced to automatically populate the database with the initial course and project data on application startup.
    *   **New API Endpoints:** Created `CourseController.java` and `ProjectController.java` to expose the new data via REST APIs (e.g., `/api/courses`, `/api/projects`).

*   **Critical Bug Fixes:**
    *   **JWT Deprecation Fixes:** Resolved all compilation errors and deprecation warnings related to the `jjwt` library by updating `JwtUtils.java` to use the modern, correct API (`verifyWith`, `parseSignedClaims`).
    *   **StackOverflowError Fix:** Fixed critical recursive bugs in `User.java` and `Role.java` entities where methods were calling themselves, which would have caused the application to crash at runtime.
    *   **Validation & Security:**
        *   Fixed a `MethodArgumentNotValidException` by correcting the JSON payload sent from the frontend during registration to match the backend `RegisterRequest` DTO.
        *   Resolved a `401 Unauthorized` error on the public registration endpoint by updating `AuthTokenFilter.java` to correctly bypass public URLs, preventing it from validating non-existent tokens.
        *   Updated `SecurityConfig.java` to manage permissions for the new course and project endpoints.

### Frontend Enhancements

*   **Dynamic Data Fetching:**
    *   **`CoursesPage.tsx` & `ProjectsPage.tsx`:** Refactored to fetch data from their respective backend APIs (`/api/courses`, `/api/projects`) instead of local static files. Added loading and error states for improved UX.
    *   **`CourseDetailPage.tsx` & `ProjectDetailPage.tsx`:** Refactored to fetch detailed data for a single item from the backend using its ID.
    *   **Static Data Deletion:** Removed the now-obsolete `src/data/courses.ts` and `src/data/projects.ts` files.

*   **Functional Bug Fixes:**
    *   **Course Access:** Fixed a bug in `CourseDetailPage.tsx` where a logged-in user could not access course content. The page now correctly uses the global `AuthContext` to determine user access.
    *   **Registration Form:** Implemented the full API call logic in `RegisterPage.tsx`, allowing new users to successfully register. The component now features full state management, validation feedback, and error handling.

---

## Deployment & Environment Configuration (24 Kasım 2025 Pazartesi)

This section documents the configuration of separate environments for localhost and the production server, as well as the complete deployment process on the Linux server.

### Environment Variable Strategy

*   **Approach:** Implemented `env` files to manage API base URLs dynamically.
*   **Localhost:** Created `.env` with `VITE_API_BASE_URL=http://localhost:8080`.
*   **Server (Production):** Created `.env.production` with `VITE_API_BASE_URL=http://51.20.56.7:8080`.
*   **Code Update:** `src/services/apiService.ts` was refactored to use `import.meta.env.VITE_API_BASE_URL` instead of hardcoded strings.

### Server Deployment Guide (Ubuntu/Linux)

#### 1. Backend (Spring Boot) Service

A `systemd` service was created to manage the backend application, ensuring it starts automatically on boot and restarts on failure.

*   **Service File:** `/etc/systemd/system/idectt-backend.service`
*   **Configuration Details:**
    *   **User:** `ubuntu`
    *   **Working Directory:** `/home/ubuntu/idecWebsite/backend/IdecTTBackend`
    *   **ExecStart:** `/usr/bin/java -jar target/IdecTTBackend-0.0.1-SNAPSHOT.jar`
    *   **Auto-Restart:** Enabled (`Restart=always`).
*   **Commands:**
    ```bash
    sudo systemctl daemon-reload
    sudo systemctl enable idectt-backend
    sudo systemctl start idectt-backend
    ```

**Troubleshooting & Fixes Applied:**
*   **Case Sensitivity:** Corrected a typo in the JAR filename in the service definition (`IdecTtBackend` -> `IdecTTBackend`).
*   **Database Error:** Fixed `FATAL: database "idecttDb" does not exist` by manually creating the database via `psql` (`CREATE DATABASE "idecttDb";`).
*   **Database Password:** Updated the `postgres` user password to match the application configuration (`131313`).

#### 2. Frontend (React/Vite) Build

The frontend is served as static files via Nginx.

*   **Build Command:** `npm run build` (Executed in the root directory).
*   **Output Directory:** `/home/ubuntu/idecWebsite/dist`.
*   **Note:** The build process automatically picks up variables from `.env.production`.

#### 3. Nginx Reverse Proxy Configuration

Nginx is configured to serve the frontend and proxy API requests to the backend, closing port 8080 to the outside world.

*   **Configuration File:** `/etc/nginx/sites-available/idectt` (Symlinked to `sites-enabled`).
*   **Key Settings:**
    *   **Port:** 80 (HTTP).
    *   **Server Name:** `51.20.56.7` (Ready to accept domain names).
    *   **Root:** `/home/ubuntu/idecWebsite/dist` (Serves React App).
    *   **Location /api:** Proxies requests to `http://127.0.0.1:8080` (Backend).

#### 4. Security

*   **UFW (Uncomplicated Firewall):** Configured to allow only necessary traffic.
    *   Allowed: `ssh`, `Nginx Full` (80/443).
    *   Blocked: Direct access to port 8080.

### Current Status
*   **Backend:** Running actively via Systemd (`active (running)`).
*   **Frontend:** Accessible via `http://51.20.56.7`.
*   **SSL:** Pending domain acquisition. Once a domain is connected, `certbot` can be run to enable HTTPS.
