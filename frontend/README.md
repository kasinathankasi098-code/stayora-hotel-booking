# Stayora Hotels and Resort

A simple React hotel-booking website made with Vite and React Router.

## Run the Website

Open a terminal in the `frontend` folder and run:

```bash
npm install
npm run dev
```

Open the local address shown by Vite in your browser.

## Booking Flow

1. Home: choose a destination.
2. Hotels: view hotels for that destination or manage hotel records.
3. Rooms: choose a room for a hotel.
4. Booking: enter guest and stay details.
5. Confirmation: view the saved booking.

## Folder Guide

- `src/pages`: Home, Hotels, Booking, and Confirmation screens.
- `src/components`: Navbar, HotelCard, and RoomCard shared by pages.
- `src/data/hotels.js`: sample hotels, cities, and room choices.
- `src/languages/translations.js`: English text.
- `src/assets/images`: local hotel and destination photos.
- `src/App.jsx`: website routes.
- `src/App.css`: page and component styles.
- `src/index.css`: global font and page defaults.

## Where to Make Changes

- Change destination choices in `src/pages/home.jsx`.
- Change sample hotels and rooms in `src/data/hotels.js`.
- Change colors and layout in `src/App.css`.
- Change the font in `src/index.css`.

## Hotel Management

The Hotels page has simple add, view, edit, and delete controls. Hotel records are saved in browser `localStorage`, so they stay in that browser after refresh. This project currently uses local sample data and does not connect to a backend.
