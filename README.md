# Aethelgard — Wedding RSVP App

Aethelgard is a wedding RSVP application that lets hosts create beautiful digital invitation cards and share them with guests, who can then RSVP directly on the invitation page.

Built with **React 18, Vite, TypeScript, Tailwind CSS**, and powered by **Lovable Cloud** (database + image storage).

## Features

### 1. Create Invitation (Host)
- Upload a pre-designed invitation card image — no form filling required.
- The app generates a unique, shareable invitation link for the event.
- Each event gets a secret **host code** used to manage it (no accounts needed).

### 2. Guest Invite Page
- Displays the uploaded card image in an elegant, animated presentation.
- Guests scroll down to an RSVP section and submit their response.
- Every submission is stored against the event.

### 3. Host Dashboard
- Shows all events the host has created, with RSVP counts.
- Full CRUD: create, view, update, and delete events via the host code.

## Tech Stack

- **Frontend:** React 18, Vite 5, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend:** Lovable Cloud (Supabase) — database, storage, auto-generated client
- **Routing:** react-router-dom
- **State/data:** TanStack React Query
- **Testing:** Vitest + Testing Library

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Run tests
npm run test

# Lint
npm run lint

# Production build
npm run build
```

## How It Works

1. **Host creates an event** at `/create` by uploading the card image.
2. The app generates a guest link like `/event/<slug>`.
3. **Guests open the link**, view the card, and RSVP.
4. **Hosts open the dashboard**, enter their host code, and manage events and view RSVPs.

## Project Structure

```
src/
├── components/        # Reusable UI (EventCard, EventDetailDialog, etc.)
├── pages/             # Index, CreateEvent, GuestInvite, Dashboard, NotFound
├── hooks/             # Custom React hooks
├── integrations/      # Auto-generated backend client (do not edit)
└── lib/               # Helpers and utilities
```

## Design

The app uses a "Heirloom Linen & Ink" aesthetic: paper and linen tones with deep ink text and a wax-seal accent, paired with Cormorant Garamond (headings) and EB Garamond (body) typography.

## Notes

- No user authentication — hosts manage events with a secret host code.
- Social share previews (Open Graph) are configured so shared links show the invitation card.
