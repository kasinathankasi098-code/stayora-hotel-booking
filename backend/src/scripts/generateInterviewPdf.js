import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.resolve(__dirname, "../../../Stayora_Hotel_Booking_Interview_Preparation_Guide.pdf");

console.log("Generating PDF at:", outputPath);

const doc = new PDFDocument({
  bufferPages: true,
  margin: 45,
  size: "A4",
  info: {
    Title: "Stayora Hotel Booking - Full Stack Interview Preparation Guide",
    Author: "Antigravity AI",
    Subject: "Full Stack Web Development Interview Questions & Explanations"
  }
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Helper styles
const primaryColor = "#0d4e6e";
const secondaryColor = "#1686c2";
const darkTextColor = "#222222";
const grayTextColor = "#555555";
const cardBgColor = "#f4f9fd";

function addHeader(title) {
  doc.addPage();
  doc.fillColor(primaryColor).fontSize(18).font("Helvetica-Bold").text(title, { underline: true });
  doc.moveDown(0.8);
}

function addSectionTitle(title) {
  doc.moveDown(0.5);
  doc.fillColor(secondaryColor).fontSize(14).font("Helvetica-Bold").text(title);
  doc.moveDown(0.4);
}

function addSubTitle(title) {
  doc.moveDown(0.3);
  doc.fillColor(primaryColor).fontSize(11).font("Helvetica-Bold").text(title);
  doc.moveDown(0.2);
}

function addBody(text) {
  doc.fillColor(darkTextColor).fontSize(9.5).font("Helvetica").text(text, { lineGap: 3, align: "justify" });
  doc.moveDown(0.4);
}

function addBullet(point, boldPrefix = "") {
  doc.fillColor(darkTextColor).fontSize(9.5);
  if (boldPrefix) {
    doc.font("Helvetica-Bold").text("• " + boldPrefix + ": ", { continued: true });
    doc.font("Helvetica").text(point, { lineGap: 2 });
  } else {
    doc.font("Helvetica").text("• " + point, { lineGap: 2 });
  }
  doc.moveDown(0.2);
}

function addQA(number, question, answer, keyTakeaway = "") {
  doc.moveDown(0.4);
  doc.fillColor(primaryColor).fontSize(10.5).font("Helvetica-Bold").text(`Q${number}: ${question}`);
  doc.moveDown(0.2);
  doc.fillColor(darkTextColor).fontSize(9.5).font("Helvetica").text(`Answer: ${answer}`, { lineGap: 2.5, align: "justify" });
  if (keyTakeaway) {
    doc.moveDown(0.15);
    doc.fillColor(secondaryColor).fontSize(9).font("Helvetica-Oblique").text(`💡 Tip to say: "${keyTakeaway}"`);
  }
  doc.moveDown(0.4);
}

// ==========================================
// COVER PAGE
// ==========================================
doc.rect(0, 0, doc.page.width, 180).fill(primaryColor);

doc.fillColor("#ffffff").fontSize(26).font("Helvetica-Bold").text("STAYORA HOTEL BOOKING", 50, 50, { align: "center" });
doc.fontSize(14).font("Helvetica").text("Full-Stack Web Application — Comprehensive Interview Guide", { align: "center" });
doc.moveDown(0.5);
doc.fontSize(10).font("Helvetica-Oblique").text("React (Vite) + Node.js + Express.js + PostgreSQL + OpenStreetMap", { align: "center" });

doc.y = 210;
doc.fillColor(darkTextColor).fontSize(12).font("Helvetica-Bold").text("Table of Contents", 50);
doc.moveDown(0.5);

const contents = [
  "1. Executive Project Summary (Elevator Pitch)",
  "2. Technical Architecture & Tech Stack Explained",
  "3. Page-by-Page Breakdown & User Journey",
  "4. Database Design & PostgreSQL Schema",
  "5. Backend API Endpoints & CRUD Architecture",
  "6. Frontend Components, Hooks & State Management",
  "7. OpenStreetMap & Coordinates Integration",
  "8. Top 25 Technical Interview Questions & High-Scoring Answers",
  "9. Non-Technical / HR Questions & Tips for Success"
];

contents.forEach((item) => {
  doc.fontSize(10).font("Helvetica").fillColor("#333333").text(item, { lineGap: 4 });
});

doc.moveDown(1.5);
doc.rect(50, doc.y, doc.page.width - 100, 70).fillAndStroke(cardBgColor, "#bcd8e9");
const boxY = doc.y - 65;
doc.fillColor(primaryColor).fontSize(10.5).font("Helvetica-Bold").text("Target Audience / Purpose of This Guide:", 60, boxY);
doc.fillColor(darkTextColor).fontSize(9).font("Helvetica").text(
  "This guide is specifically tailored for freshers and junior developers. It explains every basic concept from scratch without confusing jargon, giving you ready-to-speak interview answers so you can confidently explain the project.",
  60,
  boxY + 16,
  { width: doc.page.width - 120 }
);

// ==========================================
// SECTION 1: PROJECT SUMMARY
// ==========================================
addHeader("1. Executive Project Summary (Elevator Pitch)");

addBody(
  "Stayora is a modern, responsive Full-Stack Hotel Booking & Management Web Application. It enables guests to search for luxury hotels across top Indian destinations (Kerala, Tamil Nadu, Goa, Karnataka), view interactive maps with GPS coordinates, explore rooms, and complete bookings. Furthermore, it features a dedicated CRUD Hotel Management portal allowing administrators to Create, View, Update, and Delete hotels in real-time."
);

addSectionTitle("How to Introduce the Project in an Interview (Say this!):");
addBody(
  "\"I built 'Stayora', a full-stack hotel booking platform using React for the frontend, Node.js and Express for the REST API backend, and PostgreSQL for persistent relational data storage. The application features complete CRUD management for hotels, dynamic search and filtering by destination, room booking workflows, and embedded interactive OpenStreetMap locations based on real latitude and longitude coordinates.\""
);

addSectionTitle("Core Features at a Glance:");
addBullet("Guests can filter hotels by destination (Kerala, Tamil Nadu, Goa, Karnataka) or search by name/city.", "Destination Search & Filter");
addBullet("Displays price per night, star rating, room availability, amenities, and high-resolution visuals.", "Hotel Showcase");
addBullet("Clicking 'View Details' opens a dedicated page with an OpenStreetMap embed showing the hotel's exact GPS marker.", "Interactive Map Integration");
addBullet("A dedicated admin page (/manage-hotels) and on-card actions to Create, Read, Update, and Delete hotel listings.", "Full CRUD Management");
addBullet("Guests select rooms, input traveler details, choose payment options, and receive confirmed booking IDs.", "Reservation System");

// ==========================================
// SECTION 2: TECH STACK & ARCHITECTURE
// ==========================================
addHeader("2. Technical Architecture & Tech Stack");

addBody("The project follows the standard Client-Server 3-Tier Architecture:");

addBullet("Built using React 18 and Vite. Handles the user interface, routing, forms, client-side validation, and makes asynchronous HTTP fetch requests to the backend.", "1. Presentation Layer (Frontend)");
addBullet("Built using Node.js and Express.js. Implements RESTful API endpoints, handles business logic, request validation, CORS, error handling, and queries the database.", "2. Application Layer (Backend)");
addBullet("PostgreSQL relational database running with connection pooling via the 'pg' library. Stores normalized tables for hotels, rooms, locations, and bookings.", "3. Database Layer (PostgreSQL)");

addSectionTitle("Why These Technologies Were Chosen:");
addBullet("Component-based architecture allows reusable UI elements (Navbar, HotelCard, RoomCard). Fast bundle building with Vite.", "React (Vite)");
addBullet("Single-threaded asynchronous event loop enables handling concurrent API requests efficiently using JavaScript on both client and server.", "Node.js & Express");
addBullet("Reliable ACID-compliant relational database. Supports strong schema integrity, foreign keys, array data types (amenities), and numeric coordinates.", "PostgreSQL");
addBullet("Free, open-source mapping service with no expensive API keys or billing quotas required.", "OpenStreetMap");

// ==========================================
// SECTION 3: PAGE-BY-PAGE BREAKDOWN
// ==========================================
addHeader("3. Page-by-Page Breakdown & User Journey");

addSubTitle("1. Home Page (Route: '/' and '/home')");
addBullet("File: frontend/src/pages/home.jsx");
addBullet("Features a full-width background hero video with overlay, branding typography, and a destination dropdown.");
addBullet("The dropdown dynamically fetches destinations from backend GET /api/locations/destinations ('Kerala', 'Tamil Nadu', 'Goa', 'Karnataka').");
addBullet("Selecting a destination and clicking 'Show hotels' navigates to /hotels passing destination in React Router state.");

addSubTitle("2. Hotels Catalog Page (Route: '/hotels')");
addBullet("File: frontend/src/pages/hotel.jsx");
addBullet("Displays verified hotel cards matching the search term or selected destination.");
addBullet("Each card shows thumbnail, city, state, price, star rating, amenities badges, and a mini-map embed.");
addBullet("Actions on each card: 'View Details' (opens /hotels/:id), 'Book Now' (opens /register), 'Edit' (pre-fills /manage-hotels form), and 'Delete' (deletes hotel with confirmation).");

addSubTitle("3. Hotel Details Page (Route: '/hotels/:id')");
addBullet("File: frontend/src/pages/HotelDetails.jsx");
addBullet("Fetches specific hotel details using GET /api/hotels/:id using the ID parameter from useParams().");
addBullet("Embeds an interactive OpenStreetMap iframe using the hotel's exact latitude and longitude.");
addBullet("Lists room options (Standard, Deluxe, Suite) with facilities and 'Book Now' triggers.");
addBullet("Includes quick 'Edit Hotel' and 'Delete Hotel' admin actions directly on the page.");

addSubTitle("4. Manage Hotels CRUD Page (Route: '/manage-hotels')");
addBullet("File: frontend/src/pages/ManageHotels.jsx");
addBullet("Create Form: Inputs for Name, State, City, Destination, Price, Rooms, Rating, Latitude, Longitude, Amenities, Description, and Image upload (up to 5MB).");
addBullet("Read / Table View: Displays all hotels currently in PostgreSQL with thumbnails, GPS chips, and action buttons.");
addBullet("Update: Clicking 'Edit' pre-populates all inputs, switches the button to 'Update Hotel', and executes PUT /api/hotels/:id.");
addBullet("Delete: Confirms deletion and issues DELETE /api/hotels/:id, updating the table state instantaneously.");

addSubTitle("5. Register & Booking Confirmation (Routes: '/register', '/confirmation', '/bookings')");
addBullet("Register Page (register.jsx): Traveler details (Name, Email, Phone, Check-in, Check-out, Guests, Payment Method).");
addBullet("Confirmation Page (confirmation.jsx): Renders booking receipt with generated booking ID (e.g. STAY-XXXX).");
addBullet("My Bookings Page (bookings.jsx): Lists all confirmed reservations with status and cancellation options.");

// ==========================================
// SECTION 4: DATABASE DESIGN
// ==========================================
addHeader("4. Database Design & PostgreSQL Schema");

addBody("The database schema is defined in backend/src/db/schema.sql and managed via PostgreSQL:");

addSubTitle("1. 'hotels' Table");
addBullet("id SERIAL PRIMARY KEY: Unique auto-incrementing integer identifier.");
addBullet("name VARCHAR(255) NOT NULL: Name of the resort/hotel.");
addBullet("city VARCHAR(100), state VARCHAR(100), destination VARCHAR(100): Geographic classification.");
addBullet("price NUMERIC(10, 2) NOT NULL: Nightly rate in INR.");
addBullet("rooms INT DEFAULT 10: Available room inventory.");
addBullet("rating NUMERIC(3, 1): Rating score (e.g., 4.8).");
addBullet("image TEXT: URL or base64 data string of the hotel photo.");
addBullet("description TEXT: Descriptive overview.");
addBullet("amenities TEXT[]: PostgreSQL array of amenities (e.g., {'Free Wi-Fi', 'Breakfast'}).");
addBullet("latitude NUMERIC(10, 6), longitude NUMERIC(10, 6): Precise GPS coordinates.");

addSubTitle("2. 'rooms' Table");
addBullet("hotel_id INT REFERENCES hotels(id) ON DELETE CASCADE: Foreign key linked to hotels table.");
addBullet("name, price, available, image, facilities TEXT[].");

addSubTitle("3. 'locations' Table");
addBullet("state VARCHAR(100) UNIQUE, cities TEXT[]: Supported Indian states and city lists.");

addSubTitle("4. 'bookings' Table");
addBullet("booking_id VARCHAR(60) UNIQUE, full_name, email, phone, selected_hotel, selected_room, check_in, check_out, guests, total_price, status.");

// ==========================================
// SECTION 5: BACKEND REST APIS
// ==========================================
addHeader("5. Backend REST API Endpoints");

addBody("The backend Express server exposes standard RESTful endpoints returning JSON responses:");

addBullet("GET /api/health — Checks backend uptime and PostgreSQL database connection status.", "Health Check");
addBullet("GET /api/hotels — Retrieves all hotels; accepts query filters: ?destination=Goa, ?search=Kochi, ?minPrice=1000.", "Read All Hotels");
addBullet("GET /api/hotels/:id — Retrieves complete profile of a single hotel by its primary key.", "Read Single Hotel");
addBullet("POST /api/hotels — Creates a new hotel record. Validates required fields (name, city, price, rooms).", "Create Hotel");
addBullet("PUT /api/hotels/:id — Updates an existing hotel's fields (name, price, coordinates, etc.).", "Update Hotel");
addBullet("DELETE /api/hotels/:id — Deletes a hotel record from database.", "Delete Hotel");
addBullet("GET /api/locations/destinations — Returns distinct destinations currently present in the database.", "Destinations");
addBullet("GET /api/bookings and POST /api/bookings — Manages customer reservations.", "Bookings");

addSectionTitle("Security & Performance Highlights in Backend:");
addBullet("Parameterized Queries: Used db.query('SELECT * FROM hotels WHERE id = $1', [id]) to prevent SQL Injection attacks.", "SQL Injection Defense");
addBullet("CORS Configuration: Allows authorized origin communication between localhost:5173 (Vite) and localhost:5000 (Express).", "Cross-Origin Security");
addBullet("Payload Limit: Express JSON body parser set to 50MB to gracefully accept base64 image uploads.", "Body Parser Limit");

// ==========================================
// SECTION 6: INTERVIEW QUESTIONS PART 1
// ==========================================
addHeader("6. Top 25 Technical Interview Questions & Answers");

addQA(
  1,
  "Can you give a brief walk-through of your project?",
  "Stayora is a full-stack hotel booking platform built using React, Node.js, Express, and PostgreSQL. It has two main user personas: guests and administrators. Guests can search and filter hotels across Indian destinations, view detailed amenities and room options, explore hotel locations on an embedded OpenStreetMap, and book stays. Administrators have a dedicated CRUD dashboard to create, view, update, and delete hotels with real-time database synchronization.",
  "I focused on building a clean 3-tier architecture with full CRUD capability and interactive GIS map integration."
);

addQA(
  2,
  "Why did you use PostgreSQL instead of MongoDB?",
  "Hotels, rooms, and bookings have clearly defined, structured relationships. For example, rooms and bookings reference hotel records with relational foreign keys. PostgreSQL provides strong ACID compliance, ensuring that room counts and reservations are consistent without race conditions. It also natively supports array types for amenities and high-precision numeric types for latitude and longitude.",
  "Relational data with structured schemas and transaction consistency was a natural fit for PostgreSQL."
);

addQA(
  3,
  "How did you implement the CRUD operations for hotels?",
  "On the backend, I built RESTful endpoints in Express routed to hotelController and HotelModel. POST /api/hotels inserts a new row, GET /api/hotels fetches all rows with optional query filters, PUT /api/hotels/:id updates fields, and DELETE /api/hotels/:id deletes the record using parameterized SQL. On the frontend, ManageHotels.jsx consumes these APIs using fetch(), with immediate UI state updates and feedback alerts.",
  "I created both backend REST routes and frontend forms/tables with full input validation."
);

addQA(
  4,
  "How did you integrate maps into the hotel cards and details page?",
  "Instead of using expensive proprietary APIs, I used OpenStreetMap. Every hotel record stores latitude and longitude in PostgreSQL. On the frontend, I dynamically construct an OpenStreetMap iframe embed URL with a bounding box (bbox) and marker centered on the coordinates: 'https://www.openstreetmap.org/export/embed.html?bbox={lng-delta},{lat-delta},{lng+delta},{lat+delta}&marker={lat},{lng}'.",
  "It is lightweight, privacy-friendly, works out of the box, and doesn't require API keys."
);

addQA(
  5,
  "What is the role of React Router in your project?",
  "React Router (v6) enables Single Page Application (SPA) navigation without page reloads. I used BrowserRouter, Routes, and Route in App.jsx to configure routes like '/', '/hotels', '/hotels/:id', '/manage-hotels', and '/register'. I used useNavigate() for programmatic redirection (such as passing hotel details to the registration form) and useParams() to extract the hotel ID from the URL in HotelDetails.jsx.",
  "It enables fast, client-side routing while keeping URL states synchronized."
);

addQA(
  6,
  "What is the difference between state and props in React?",
  "State is internal data managed within a component that can change over time (e.g., the hotels array or search query in hotel.jsx). When state updates via useState, the component re-renders. Props (properties) are read-only data passed from a parent component to a child component (e.g., passing hotel and text props from hotel.jsx to HotelCard.jsx).",
  "State is internal and mutable; props are external and immutable."
);

addQA(
  7,
  "How do you handle asynchronous operations in React?",
  "I use JavaScript async/await syntax inside useEffect hooks. Because useEffect callback functions cannot directly be async, I declare an internal async function (e.g., fetchHotels) and invoke it. I also use Promise.all() or Promise.allSettled() when fetching multiple resources simultaneously (like hotels, locations, and rooms) to improve initial page load performance.",
  "Always handle loading states and catch errors gracefully inside async functions."
);

addQA(
  8,
  "How do you protect your backend against SQL Injection?",
  "I strictly avoid string concatenation like `SELECT * FROM hotels WHERE id = ' + id`. Instead, I use parameterized queries provided by the 'pg' library: `db.query('SELECT * FROM hotels WHERE id = $1', [id])`. The PostgreSQL engine compiles the query template first, treating parameters strictly as literal values rather than executable SQL code.",
  "Parameterized queries guarantee that user input can never alter query logic."
);

// ==========================================
// SECTION 7: INTERVIEW QUESTIONS PART 2
// ==========================================
addHeader("7. Additional Interview Questions (Advanced & Practical)");

addQA(
  9,
  "What is CORS and how did you configure it?",
  "CORS stands for Cross-Origin Resource Sharing. By default, browsers block frontend applications (running on http://localhost:5173) from requesting APIs on a different origin or port (http://localhost:5000). In server.js, I imported the 'cors' middleware in Express and configured allowed origins to safely permit frontend requests while preventing unauthorized domain access.",
  "CORS is a browser security mechanism; Express middleware permits legitimate cross-port communication."
);

addQA(
  10,
  "How did you handle image uploads for hotels?",
  "In the frontend hotel management form, I implemented a file input listener using the FileReader API (`readAsDataURL`). This converts the user's selected image file into a base64-encoded string previewable immediately in the UI. When submitted, the string is sent in the JSON payload. To prevent 'Payload Too Large' (HTTP 413) errors, I configured Express body-parser with a 50MB limit: `express.json({ limit: '50mb' })`.",
  "FileReader provides instant client preview and Express limits accommodate image payloads."
);

addQA(
  11,
  "What HTTP status codes did you use in your API?",
  "I used standard REST HTTP status codes: 200 OK for successful GET and PUT requests; 201 Created when a hotel or booking is successfully inserted; 400 Bad Request if mandatory fields are missing; 404 Not Found if a requested hotel ID does not exist; and 500 Internal Server Error for unhandled database exceptions.",
  "Using correct status codes helps the frontend respond intelligently to API outcomes."
);

addQA(
  12,
  "How does the hotel search and filter functionality work?",
  "It is implemented both client-side and server-side. In the frontend, hotel.jsx has a filter function checking if the search keyword is included in the hotel's name, city, state, or destination. On the backend, HotelModel.findAll() supports query parameters like ?destination=Goa or ?search=Kochi, appending SQL conditions with `ILIKE` or `LOWER()` for case-insensitive matching.",
  "Dual-layer filtering ensures responsive typing feedback and efficient database querying."
);

addQA(
  13,
  "What happens step-by-step when a user books a room?",
  "1. Guest clicks 'Book Now' on a hotel or room card. 2. The hotel name and room type are saved in state/localStorage, and user is navigated to /register. 3. Guest fills out traveler information and payment method. 4. Clicking 'Confirm' sends POST /api/bookings to the backend. 5. Backend generates a unique booking ID (e.g. STAY-1710000001) and saves it to PostgreSQL. 6. Guest is redirected to /confirmation displaying the full receipt.",
  "It is an end-to-end multi-step flow with input validation and database persistence."
);

addQA(
  14,
  "What is connection pooling and why is it used in PostgreSQL?",
  "Instead of opening and closing an expensive TCP database connection for every single HTTP request, a connection pool (via 'pg.Pool') creates a reusable pool of active connections. When an incoming request arrives, a client is leased from the pool, executes the query, and is released back to the pool immediately. This drastically reduces connection latency and CPU overhead.",
  "Pools maximize throughput and prevent database overload under concurrent traffic."
);

addQA(
  15,
  "What challenges did you face during development and how did you resolve them?",
  "One challenge was adding GPS coordinates to existing database records without breaking existing queries. I resolved this by adding idempotent migrations (`ALTER TABLE hotels ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 6)`) and updating both schema and seed data. Another challenge was payload size errors when users uploaded photos, which I resolved by increasing Express body limits to 50MB and adding a 5MB client validation check.",
  "Always mention the problem, your debugging steps, and the concrete engineering fix."
);

addQA(
  16,
  "If you had more time, what features would you add next?",
  "I would implement user authentication using JWT (JSON Web Tokens) or OAuth, integrate a live payment gateway like Razorpay or Stripe, add automated email notifications on booking confirmation using Nodemailer, and deploy the application on AWS or Render with PostgreSQL hosted on Supabase or Neon.",
  "Showing future vision demonstrates an engineering mindset and awareness of production systems."
);

// ==========================================
// SECTION 8: HR / NON-TECHNICAL QUESTIONS
// ==========================================
addHeader("8. HR & Behavioral Interview Tips");

addSubTitle("1. 'Tell me about yourself'");
addBody(
  "\"I am a passionate Full-Stack Developer with strong foundations in React, Node.js, Express, and PostgreSQL. I enjoy building end-to-end web applications that solve practical problems. Recently, I developed Stayora, a hotel booking and CRUD management application with interactive map integration and dynamic database querying. I am eager to contribute my problem-solving skills to your development team.\""
);

addSubTitle("2. Key Rules for Acing the Technical Interview:");
addBullet("Do not memorize blindly: Understand WHY you chose a tool (e.g., PostgreSQL for relational integrity, OpenStreetMap for zero-cost coordinates).", "Rule 1");
addBullet("Speak with clarity: Break down your answers into 1) What it is, 2) How you built it, and 3) The result.", "Rule 2");
addBullet("Be honest about bugs: When asked about challenges, talk about errors you encountered (like body-parser size limits or SQL column migrations) and how you solved them.", "Rule 3");
addBullet("Demonstrate code awareness: Mention file names like ManageHotels.jsx, HotelDetails.jsx, HotelModel.js, and schema.sql to show you actually wrote the code.", "Rule 4");

// Final Page Numbering
const totalPages = doc.bufferedPageRange().count;
for (let i = 0; i < totalPages; i++) {
  doc.switchToPage(i);
  doc.fillColor("#888888").fontSize(8).font("Helvetica").text(
    `Stayora Hotel Booking — Interview Preparation Guide | Page ${i + 1} of ${totalPages}`,
    50,
    doc.page.height - 35,
    { align: "center", width: doc.page.width - 100 }
  );
}

doc.end();

writeStream.on("finish", () => {
  console.log("PDF generated successfully at:", outputPath);
});
writeStream.on("error", (err) => {
  console.error("PDF generation failed:", err);
});
