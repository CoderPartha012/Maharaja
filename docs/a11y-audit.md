# Accessibility Audit — Maharaja Restaurant

**Audit method:** Code review + axe-core rules mapping  
**Standard:** WCAG 2.1 Level AA  
**Date:** 2026-05-17

---

## Summary

| Severity | Count |
| -------- | ----- |
| Critical | 4     |
| Serious  | 6     |
| Moderate | 5     |
| Minor    | 3     |

---

## Issues

### CRITICAL

| #   | Page | Rule             | Element                                              | Recommendation                                                   |
| --- | ---- | ---------------- | ---------------------------------------------------- | ---------------------------------------------------------------- |
| 1   | All  | `color-contrast` | `text-[#D4AF37]` on white (#FFF)                     | Ratio 1.99:1, need 4.5:1. Use `#7A5C00` (5.71:1).                |
| 2   | All  | `color-contrast` | `btn-primary` — white text on gold bg                | Ratio 1.99:1. Use `text-[#1A1000]` (8.4:1).                      |
| 3   | All  | `label`          | Form inputs have no `id`/`htmlFor` association       | Add matching `id` to each input and `htmlFor` to each `<label>`. |
| 4   | All  | `color-contrast` | Gold focus ring on white bg (`focus:ring-[#D4AF37]`) | Ring 1.99:1 on white. Use `focus:ring-[#7A5C00]` (5.71:1).       |

### SERIOUS

| #   | Page                 | Rule                | Element                                                   | Recommendation                                                                     |
| --- | -------------------- | ------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 5   | All                  | `aria-hidden-focus` | Mobile menu toggle: no `aria-label`, no `aria-expanded`   | Add `aria-label="Open navigation menu"` and toggle `aria-expanded`.                |
| 6   | All                  | `keyboard`          | Mobile menu: Esc doesn't close it                         | Listen for `keydown` Escape and call `setIsOpen(false)`.                           |
| 7   | All                  | `bypass`            | No skip-navigation link                                   | Add visually-hidden skip link as first focusable element; link to `#main-content`. |
| 8   | Contact, Reservation | `aria-live`         | Form success/error not announced to screen readers        | Wrap status messages in `<div aria-live="polite">`.                                |
| 9   | All                  | `link-name`         | Social media icon links in footer have no accessible name | Add `aria-label="Follow us on Facebook"` etc.                                      |
| 10  | Gallery              | `aria-pressed`      | Filter buttons have no pressed state                      | Add `aria-pressed={selectedCategory === cat}`.                                     |

### MODERATE

| #   | Page        | Rule               | Element                                                                           | Recommendation                                                                     |
| --- | ----------- | ------------------ | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 11  | Reservation | `label`            | DatePicker input not associated with visible label                                | Use `Controller` with explicit `id`; pass `id` to DatePicker `inputProps`.         |
| 12  | Menu        | `aria-pressed`     | Cuisine/spice filters are `<select>` (fine), but missing visible reset affordance | Add visible "Reset filters" button when non-default filter is active.              |
| 13  | Gallery     | `focus-management` | Image zoom: focus doesn't reliably return to trigger on close                     | Verified react-medium-image-zoom v5 handles this; ensure trigger has `aria-label`. |
| 14  | All         | `focus-visible`    | Focus rings suppressed globally by Tailwind reset                                 | Add explicit `:focus-visible` ring to all interactive elements in global CSS.      |
| 15  | All         | `scrollTo`         | Duplicate `window.scrollTo` in Navbar useEffect + App.tsx ScrollToTop             | Remove duplicate from Navbar.                                                      |

### MINOR

| #   | Page        | Rule                | Element                                              | Recommendation                                                     |
| --- | ----------- | ------------------- | ---------------------------------------------------- | ------------------------------------------------------------------ |
| 16  | All         | `landmark-one-main` | `<main>` exists but no `id` for skip-link target     | Add `id="main-content"` to the `<main>` element.                   |
| 17  | Contact     | `frame-title`       | `<iframe>` for Google Maps has no `title`            | Add `title="Maharaja Restaurant Location on Google Maps"`. (Done.) |
| 18  | Reservation | `autocomplete`      | Name/email/phone inputs missing `autocomplete` attrs | Add `autoComplete="name"`, `"email"`, `"tel"`.                     |

---

## Contrast Colour Reference

| Use case                       | Current      | Ratio on white | Fix       | New ratio |
| ------------------------------ | ------------ | -------------- | --------- | --------- |
| Gold text/icons on white/cream | `#D4AF37`    | 1.99:1 ❌      | `#7A5C00` | 5.71:1 ✓  |
| Button text on gold bg         | white `#FFF` | 1.99:1 ❌      | `#1A1000` | 8.4:1 ✓   |
| Focus ring on white            | `#D4AF37`    | 1.99:1 ❌      | `#7A5C00` | 5.71:1 ✓  |
| Gold text on gray-900 (footer) | `#D4AF37`    | 9.61:1 ✓       | keep      | —         |
| Brown `#8B4513` on cream       | —            | 6.01:1 ✓       | keep      | —         |
| Gray-700 on white (nav links)  | —            | 11.3:1 ✓       | keep      | —         |

---

## Post-fix Verification

Run after each change:

```bash
# CLI axe scan (requires running dev server)
npx @axe-core/cli http://localhost:5173 --include main
npx @axe-core/cli http://localhost:5173/menu --include main
npx @axe-core/cli http://localhost:5173/reservations --include main
npx @axe-core/cli http://localhost:5173/gallery --include main
npx @axe-core/cli http://localhost:5173/contact --include main
```
