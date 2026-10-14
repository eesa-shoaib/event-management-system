# Remaining Work

Checklist based on `docs/event_management_system_specs.md`. “Done” means implemented in code, not only scaffolded.

## Authentication

- [x] Make registration create and retain a demo user for later login.
- [x] Make login validate credentials against registered demo users and show invalid-credential errors.
- [x] Provide a built-in first-run demo login for testing.
- [x] Set initial auth state to unauthenticated with no current user.
- [x] Persist and restore the session with `localStorage`; store only salted password hashes, not passwords.
- [ ] Manually check registration, login (including first-run demo login), session refresh, and logout flows.

## Event Discovery

- [x] Fetch and map Ticketmaster event results.
- [x] Search by keyword and filter by classification.
- [x] Paginate results.
- [x] Show loading, empty, and API-error states.
- [x] Wire event discovery cards to register the signed-in user, redirect signed-out users to login, prevent repeat registration, and show registered state/confirmation.
- [ ] Manually check mobile and desktop layouts.

## Event Details

- [x] Fetch event by route ID and show loading and error states.
- [x] Show event name, image, date/time, venue/location, classification, and Ticketmaster link.
- [ ] Show any other useful metadata returned by Ticketmaster.
- [x] Add event registration from the details page, associated with the signed-in user; redirect signed-out users to login and prevent duplicate registration.
- [x] Show themed pop-up success feedback when registering from discovery or event details.
- [x] Remove the duplicate, unconnected Register button from event metadata.

## Registrations and My Events

- [x] Wire discovery and details registration buttons to Redux.
- [x] Prevent duplicate registrations for the same event per user in the registrations reducer.
- [ ] Persist registrations in `localStorage`.
- [x] Protect `/my-events`; redirect signed-out users to `/login`.
- [x] Show the current user's registered event cards.
- [x] Separate upcoming and past events using event dates.
- [x] Add a cancellation action for registered events.
- [x] Show themed pop-up feedback when a registration is cancelled.
- [ ] Move registration timestamp creation out of the reducer.

## Navigation and Routing

- [x] Configure discovery, details, login, registration, and My Events routes.
- [x] Add shared navbar with event, My Events, account, and sign-in/sign-up navigation.
- [x] Fix TypeScript error in navbar's `NavLink` active-class callback.
- [x] Make navbar usable on small screens.
- [ ] Manually verify route protection after authentication is implemented.

## Setup and Delivery

- [x] Add React, React Router, Redux Toolkit, and Ticketmaster dependencies.
- [x] Ignore `.env` files and `node_modules`.
- [x] Replace Vite starter README with app overview, setup, demo login, and API-key instructions.
- [x] Document the built-in demo account credentials for first-run login testing.
- [x] Fix remaining TypeScript build error in `AuthForm.tsx`.
- [x] Run production build successfully.
- [ ] Use a server-side API proxy before production; `VITE_` API keys are visible in browser code.
