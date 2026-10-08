# Event Management System - Specification & Requirements

## Tech Stack Requirements
- **Frontend Framework:** React.js
- **Routing:** React Router
- **State Management:** Redux Toolkit (`configureStore`, `createSlice`, `useSelector`, `useDispatch`)
- **External API:** Ticketmaster Discovery API (v2)
- **Persistence:** Local Storage (for session state)

---

## Core Features & Modules

### 1. User Authentication (Frontend Simulation)
- Features: User Registration, Login, Logout.
- Form Fields: Name, Email, Password.
- Requirements:
  - Auth state managed via Redux Toolkit.
  - Persist login session across page refreshes using `localStorage`.
  - Associate registration state with the currently logged-in user.

### 2. Event Exploration
- Features:
  - View available and upcoming events.
  - Search events by query string.
  - Filter events by category/classification.
- Integration: Events fetched dynamically from Ticketmaster Discovery API.

### 3. Event Details
- View specific details for selected events:
  - Event Name
  - Date & Time
  - Venue & Location
  - Category / Classification
  - Event Image
  - Additional metadata provided by the API

### 4. Event Registration & "My Events"
- **Registration Logic:**
  - Authenticated users can register for an event.
  - Prevent duplicate registrations for the same event per user.
  - Provide feedback alerts/notifications upon registration or error.
  - Allow user to cancel an existing registration.
- **My Events View (`/my-events`):**
  - Display all events registered by the current user.
  - Segment or filter events into **Upcoming** and **Completed** based on event date.
  - Provide inline action to cancel registrations.

---

## State & Architecture Specifications

### Redux Toolkit Structure
State should be modularized into slices:
1. `auth`: User authentication status, current user profile, token/session data.
2. `events`: API search results, filters, active event details, loading/error states.
3. `registrations`: Array of user-registered event IDs/objects mapped to user account.

### React Router Navigation
Suggested route structure:
- `/` or `/events` — Event Discovery & Search
- `/events/:id` — Event Detail view
- `/login` — Login form
- `/register` — Registration form
- `/my-events` — Protected route for user-registered events

---

## External API Integration

- **API:** Ticketmaster Discovery API v2
- **Base Endpoint:** `https://app.ticketmaster.com/discovery/v2/events.json`
- **Authentication:** Query parameter `apikey=YOUR_API_KEY`
- **Documentation:** [Ticketmaster Discovery API v2](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/)
- **Security:** Use environment variables (`.env`) for local development; never expose API keys in repository commits.
- **Limits:** Default quota is 5,000 requests/day, 2 requests/second.

---

## Non-Functional & UI Requirements
- **Component Architecture:** Modular and reusable React components.
- **State Handling:** Robust handling of loading spinners, empty search states, and API error states.
- **Form Handling:** Form validation for login and registration inputs.
- **Responsive UI:** Mobile and desktop friendly layout.

---

## Project Setup & Deliverables
- `package.json` with required dependencies (`@reduxjs/toolkit`, `react-redux`, `react-router-dom`, etc.).
- `.gitignore` configured to exclude `.env` and `node_modules`.
- `README.md` containing setup commands, environment key configuration instructions, and application overview.