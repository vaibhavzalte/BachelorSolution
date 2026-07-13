# BachelorSolution - AI Development Rules

## Project

This project is a production-level application built with Next.js 15 App Router and TypeScript.

Every generated component, page, API integration, and utility MUST follow these rules.

---

# Tech Stack

- Next.js 15
- App Router
- TypeScript
- Tailwind CSS v4
- Shadcn UI
- Axios
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Framer Motion
- Lucide React

Never use plain CSS files except globals.css.

---

# Folder Structure

src/

    app/
    api/
    components/
    hooks/
    lib/
    providers/
    services/
    store/
    types/
    utils/
    constants/
    assets/

Never create random folders.

Always use the correct folder.

---

# Components

Every UI component must be inside

components/

Examples

components/layout

components/navbar

components/sidebar

components/cards

components/listing

components/forms

components/common

components/ui

Never create very large components.

Maximum 200-250 lines.

Split into reusable components.

---

# Component Rules

Every component should

✔ use TypeScript

✔ export default

✔ receive typed props

✔ never use any

Example

interface ListingCardProps{

listing: Listing

}

Never use any.

---

# API

Never call axios inside pages.

Always use

api/

Example

api/room.api.ts

api/user.api.ts

api/auth.api.ts

---

# Services

Business logic belongs inside

services/

Example

room.service.ts

Never write API transformation inside components.

---

# React Query

Always create hooks

hooks/

Examples

useRooms.ts

useRoom.ts

useProfile.ts

Never fetch directly inside components.

---

# Colors

Never hardcode colors.

Always use CSS variables.

Correct

bg-[var(--primary)]

text-[var(--text)]

border-[var(--border)]

Wrong

bg-blue-600

text-red-500

border-gray-200

---

# Theme

Every color comes from globals.css

Example

:root{

--primary:

--secondary:

--background:

--card:

--text:

--muted:

--success:

--danger:

--warning:

--border:

--radius:

}

Changing globals.css should change the whole website theme.

---

# Shadows

Never write custom shadows.

Use

shadow-soft

shadow-card

shadow-hover

defined in Tailwind.

---

# Border Radius

Always use

rounded-xl

rounded-2xl

rounded-3xl

No random radius.

---

# Spacing

Use

p-4

p-6

p-8

gap-4

gap-6

gap-8

Avoid arbitrary values.

---

# Typography

Use

text-sm

text-base

text-lg

text-xl

font-medium

font-semibold

font-bold

Never use inline font sizes.

---

# Icons

Use only

lucide-react

Never use emojis.

---

# Images

Always use

next/image

Never use img tag.

---

# Routing

Every listing has a separate URL.

Example

/rooms/fully-furnished-2bhk-flat

/roommates/looking-roommate

/mess/healthy-mess

Never use

?id=123

---

# SEO

Every page must export metadata.

Example

export const metadata={

title:

description:

keywords:

}

Every listing page should generate metadata dynamically.

---

# Loading

Always create

loading.tsx

Use skeletons.

Never use "Loading..."

---

# Error

Always create

error.tsx

Use a proper UI.

Never return plain text.

---

# Empty State

Always show

No listings found

with icon and button.

Never show blank page.

---

# Forms

Always use

React Hook Form

+

Zod

No uncontrolled forms.

---

# State

Global

Zustand

Server

React Query

Local

useState

Never misuse Context API.

---

# Responsive

Must support

Mobile

Tablet

Laptop

Desktop

Sidebar

Desktop

Visible

Tablet

Collapsed

Mobile

Drawer

---

# Performance

Prefer Server Components.

Only use "use client" when necessary.

Lazy load heavy components.

Use Suspense.

---

# Accessibility

Buttons

aria-label

Images

alt

Inputs

label

Dialogs

keyboard support

---

# File Naming

PascalCase

ListingCard.tsx

Navbar.tsx

RoomCard.tsx

camelCase

useRooms.ts

room.service.ts

Never use snake_case.

---

# Import Order

1 Components

2 Hooks

3 Services

4 Types

5 Utils

6 CSS

---

# Comments

Only comment complex business logic.

Do not comment obvious code.

---

# Tailwind

Use utility classes.

Avoid inline styles.

Never use style={{}}

unless absolutely required.

---

# Animation

Use Framer Motion.

Animation should be subtle.

No flashy animations.

---

# Code Style

Prefer early return.

Use optional chaining.

Use nullish coalescing.

Avoid nested if.

Prefer map over for loops.

Use async/await.

---

# Types

All API responses must have interfaces.

Example

interface Listing{

id:number

title:string

price:number

}

No any.

---

# AI Instructions

Whenever generating code:

Think like a Senior Frontend Engineer.

Prioritize

- reusable components

- scalability

- readability

- performance

- SEO

- accessibility

- responsive design

Do not generate quick demo code.

Generate production-ready code.

If a component becomes too large,
split it into smaller reusable components.

Always explain where each file belongs in the project structure.

Follow these rules for every response.