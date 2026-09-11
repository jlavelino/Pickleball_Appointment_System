# DINK — frontend (Vue / Nuxt 3)

UI-only scaffold for the pickleball booking flow: date/time → court →
paddles → food → summary → payment → QR confirmation. Matches the
DINK visual mockup (navy / lime / clay, Fraunces + Inter).

## Run it

```bash
npm install
npm run dev
```

Then visit `/book` to start the flow.

## What's wired vs. mocked

Every screen is fully interactive — the calendar, steppers, court
selection, hold countdown, and QR screen all work end-to-end using a
single Pinia store (`stores/booking.js`) that carries state across
the 7 pages. What's **mocked**, ready to swap for real calls:

- `pages/book/index.vue` — `slots` (replace with real court
  availability for the selected date)
- `pages/book/court.vue` — `courts` (replace with real court list)
- `pages/book/paddles.vue` — `paddleOptions` (replace with the
  `paddles` table)
- `pages/book/food.vue` — `foodOptions` (replace with the
  `food_items` table)
- `pages/book/summary.vue` — the `onMounted` block fakes a
  `bookingId` / `holdExpiresAt`. Replace with a call to the
  `create_booking_hold` Postgres RPC function (from the SQL file)
  via `supabase.rpc(...)`.
- `pages/book/payment.vue` — `pay()` just waits and redirects.
  Replace with a call to a PayMongo checkout session, then let the
  webhook (which calls `confirm_booking_payment`) redirect back here.
- `components/booking/BookingQr.vue` — the QR is a decorative CSS
  grid placeholder. Swap in a real QR encoder (e.g. the `qrcode`
  npm package) once you have a real `bookingId`.

## Folder structure

```
components/booking/   — CalendarPicker, TimeSlotList, CourtCard,
                         ItemStepper, OrderSummary, PaymentMethodCard,
                         BookingQr
components/ui/         — AppBar, BottomCta, HoldTimer
stores/booking.js       — Pinia store shared by all 7 pages
pages/book/             — one file per step, file-based routing
```
