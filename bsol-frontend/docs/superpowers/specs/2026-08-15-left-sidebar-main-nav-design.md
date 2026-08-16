# Left Sidebar Main Navigation

**Date:** 2026-08-15  
**Status:** Approved design

## Goal

Make the left sidebar website-level navigation only. Listing categories belong in the feed filters / right sidebar, not the left nav.

## Scope

**In scope**

- Update `components/layout/Sidebar.tsx` menu item arrays and layout sections.
- Remove category entries from the left sidebar.
- Add Settings to the bottom account section.
- Keep existing resize, collapse, mobile drawer, and promo card behavior.

**Out of scope**

- New pages/routes for Saved, My Listings, Messages, Profile, Settings, Logout.
- Changes to `constants/sidebar.config.ts` category list used by the right sidebar.
- Changes to `CategoryFilters` or feed category filtering.

## Navigation structure

### Top section (primary site actions)

| Item | Behavior |
|------|----------|
| Home | Sets active item; sets category to `all` (unchanged) |
| Saved | Sets active item only |
| My Listings | Sets active item only |
| Messages | Sets active item only |

### Bottom section (account actions)

Pinned toward the bottom of the sidebar column (existing `justify-between` layout).

| Item | Behavior |
|------|----------|
| Profile | Sets active item only |
| Settings | Sets active item only (new; icon + label, no route yet) |
| Logout | Sets active item only |

### Removed from left sidebar

Rooms, Roommates, Vacancies, Food Stalls, Mess, Study Rooms.

These remain available via right sidebar / category filters.

## Implementation approach

Rebuild the two menu arrays in `Sidebar.tsx`:

1. `primaryMenuItems` → Home, Saved, My Listings, Messages.
2. `secondaryMenuItems` → Profile, Settings, Logout.
3. Drop unused category icon imports; add `Settings` from lucide-react.
4. Leave click handler logic as-is (`setActiveSidebarItem`; `setActiveCategory` only when `item.category` is present).

## Success criteria

- Left sidebar shows only the seven items above (four top, three bottom — no Explore, no listing categories).
- No listing-category items in the left sidebar.
- Home still resets the feed category to all.
- Desktop resize/collapse and mobile sheet continue to work.
- Right sidebar and category filters still expose listing categories.
