# Event Management System

A React and TypeScript event discovery app. Browse Ticketmaster events, search by keyword or category, view event details, and register for events. Signed-in users can see and cancel registrations on their **My Events** page.

## Features

- Ticketmaster event search with category filters and pagination
- Event detail pages
- Demo account registration and login
- Protected My Events page with upcoming and past registrations
- Responsive interface built with Tailwind CSS and daisyUI
- Redux Toolkit state management and React Router navigation

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- A Ticketmaster Discovery API key

## Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create a local environment file from the example:

   ```sh
   cp .env.example .env
   ```

3. Set your Ticketmaster API key in `.env`:

   ```dotenv
   VITE_TICKETMASTER_API_KEY=your_ticketmaster_api_key
   ```

   Get a key from the [Ticketmaster Developer Portal](https://developer.ticketmaster.com/). Restart the dev server after changing environment variables.

4. Start the development server:

   ```sh
   npm run dev
   ```

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

## Demo authentication and registrations

Accounts are created and checked locally in the browser. User profiles, salted password hashes, and the login session are stored in `localStorage`; this is a frontend demo, not production authentication.

For a first-run login, use the built-in demo account:

| Email | Password |
| --- | --- |
| `demo@dev.dev` | `1234567890` |

The demo account is created in the browser on the first successful login, and its password is stored as a salted hash. These public demo credentials are for local testing only; do not use them for a deployed or production application.

Registrations are currently held in Redux memory. They are associated with the signed-in user and are lost when the page is refreshed. The Ticketmaster API key is included in browser requests because it uses the `VITE_` prefix; do not use this client-side setup for a production secret. A production deployment should use a server-side API proxy and backend account/registration storage.

## Tech stack

- React, TypeScript, and Vite
- Redux Toolkit and React Redux
- React Router
- Tailwind CSS and daisyUI
- Ticketmaster Discovery API v2
