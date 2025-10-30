Hello Grok. I would like you to build a complete full-stack Event Management Web Application.

Here is a detailed breakdown of the project requirements, features, design, technology, and structure.

### 1. Project Goal

Create a modern, minimalist web application where users can sign up to become "Hosts" and "Attendees." Hosts can create and manage events, and Attendees can browse and RSVP to those events (for free). The application must feature a central dashboard for logged-in users to manage their activities.

### 2. Core User Types

1.  **Event Host:** A user who creates and manages events.
2.  **Event Attendee:** A user who browses and RSVPs to events.
    *(Note: A single user account can perform both roles).*

### 3. Key Features (User Stories)

**A. Authentication:**
* **Sign Up:** As a new user, I can navigate to a "Sign Up" page and create an account using an email and password.
* **Sign In:** As an existing user, I can navigate to a "Sign In" page and log in with my email and password.
* **Security:** After logging in, I should receive a JWT (JSON Web Token) that will be used to authenticate all my future API requests.

**B. User Dashboard (Main Page after Login):**
* This is the main hub of the application. It must be a single page (`dashboard.html`) that cleanly displays three distinct sections:
    1.  **"Events I'm Hosting":** A list/grid of all events created by the logged-in user.
    2.  **"Events I'm Attending":** A list/grid of all events the logged-in user has RSVP'd to.
    3.  **"All Current Events":** A browsable list/grid of all events currently on the platform, created by any host.

**C. Event Management (Host):**
* **Create Event:** As a logged-in user, I must have a clear "Create New Event" button or form (perhaps on the dashboard).
* **Event Form:** This form must collect:
    * Event Title
    * Description
    * Event Date & Time
    * Location (as a text field)
* **View Hosted Events:** My "Events I'm Hosting" dashboard section should update immediately after I create a new event.

**D. Event Browsing & RSVP (Attendee):**
* **Browse:** As a user, I can see all public events in the "All Current Events" section.
* **Event Details:** I can click on any event (from any section) to see its full details (title, description, date, time, location, and who is hosting it).
* **RSVP (Unpaid):** For any event I am *not* hosting, I must see an "RSVP" button.
* **RSVP Confirmation:** Clicking "RSVP" should register me for the event. The button should then change to "RSVP'd" (or be disabled), and the event should appear in my "Events I'm Attending" section.
* **No Double RSVP:** The system must prevent me from RSVP'ing to the same event more than once.

### 4. Design & UI/UX (Modern & Minimalist)

* **Style:** Clean, spacious, and professional.
* **Layout:** Use CSS Flexbox and/or Grid for all layouts. The application must be fully responsive and look great on mobile devices.
* **Color Palette:**
    * Primary Background: White (`#FFFFFF`) or very light gray (`#F8F9FA`).
    * Text: Dark gray (`#212529`).
    * Accent Color: A single, modern color like a deep blue (`#007BFF`) or teal (`#20C997`) for buttons, links, and headers.
    * Borders: Use subtle, light gray borders (`#DEE2E6`).
* **Components:**
    * **Event Cards:** Display events as clean "cards" with padding, `border-radius: 8px;`, and a subtle `box-shadow`.
    * **Buttons:** Solid color (accent) on hover, and a lighter tint or "outline" style by default.
    * **Forms:** Simple, clean input fields with clear labels positioned above them.
* **Typography:** Use a clean, sans-serif font like **Inter** or **Poppins** (import from Google Fonts).

### 5. Technology Stack

* **Frontend:** Vanilla HTML5, CSS3, and modern JavaScript (ES6+).
    * Use `fetch()` for all API calls.
    * Manage authentication by saving the JWT to `localStorage` or `sessionStorage` on login and attaching it to an `Authorization: Bearer <token>` header for all protected API requests.
* **Backend:** Java 17+ & Spring Boot (latest stable version).
    * Use Spring Web, Spring Data JPA, and Spring Security.
* **Database:** MySQL.

### 6. Proposed Directory Structure (MANDATORY)

Please organize the entire project within this exact structure:

```
event-management-app/
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/example/eventapp/
│           │       ├── controller/
│           │       │   ├── AuthController.java
│           │       │   ├── EventController.java
│           │       │   └── UserController.java
│           │       ├── dto/
│           │       │   ├── LoginRequest.java
│           │       │   ├── SignUpRequest.java
│           │       │   ├── EventDTO.java
│           │       │   └── UserDTO.java
│           │       ├── model/
│           │       │   ├── User.java
│           │       │   ├── Event.java
│           │       │   └── Rsvp.java
│           │       ├── repository/
│           │       │   ├── UserRepository.java
│           │       │   ├── EventRepository.java
│           │       │   └── RsvpRepository.java
│           │       ├── service/
│           │       │   ├── AuthService.java
│           │       │   ├── EventService.java
│           │       │   └── UserService.java
│           │       ├── security/
│           │       │   ├── JwtTokenProvider.java
│           │       │   ├── SecurityConfig.java
│           │       │   └── UserDetailsServiceImpl.java
│           │       └── EventappApplication.java
│           └── resources/
│               └── application.properties
│
└── frontend/
    ├── index.html           (Login & Sign Up Page)
    ├── dashboard.html       (Main App Page)
    ├── css/
    │   ├── style.css        (Global styles, fonts, colors)
    │   ├── auth.css         (Styles for index.html)
    │   └── dashboard.css    (Styles for dashboard.html)
    └── js/
        ├── auth.js          (Handles Sign Up/Sign In logic for index.html)
        ├── dashboard.js     (Handles all logic for dashboard.html: fetching data, creating events)
        └── api.js           (A helper module for making fetch requests, managing JWT)
```

### 7. Backend API & Database Schema

**A. Database Schema:**

1.  **`users`**
    * `id` (BIGINT, Primary Key, Auto-increment)
    * `email` (VARCHAR, Not Null, Unique)
    * `password` (VARCHAR, Not Null - must be BCrypt encoded)

2.  **`events`**
    * `id` (BIGINT, Primary Key, Auto-increment)
    * `title` (VARCHAR, Not Null)
    * `description` (TEXT)
    * `event_date_time` (DATETIME, Not Null)
    * `location` (VARCHAR)
    * `host_id` (BIGINT, Foreign Key to `users.id`)

3.  **`rsvps`**
    * `id` (BIGINT, Primary Key, Auto-increment)
    * `user_id` (BIGINT, Foreign Key to `users.id`)
    * `event_id` (BIGINT, Foreign Key to `events.id`)
    * *Constraint:* Add a `UNIQUE` constraint on (`user_id`, `event_id`) to prevent duplicate RSVPs.

**B. API Endpoints (RESTful):**

* `POST /api/auth/signup`
    * Body: `{ "email": "...", "password": "..." }`
    * Response: Success message.
* `POST /api/auth/login`
    * Body: `{ "email": "...", "password": "..." }`
    * Response: `{ "token": "jwt.token.here" }`
* `GET /api/events` (Protected)
    * Response: `[EventDTO, ...]` (A list of all events)
* `POST /api/events` (Protected)
    * Body: `{ "title": "...", "description": "...", "eventDateTime": "...", "location": "..." }`
    * Response: The newly created `EventDTO`. (The `host_id` should be taken from the authenticated user's token).
* `GET /api/users/me/hosted-events` (Protected)
    * Response: `[EventDTO, ...]` (List of events hosted by the logged-in user)
* `GET /api/users/me/attended-events` (Protected)
    * Response: `[EventDTO, ...]` (List of events RSVP'd by the logged-in user)
* `POST /api/events/{eventId}/rsvp` (Protected)
    * Response: Success message or the new RSVP object.
* `DELETE /api/events/{eventId}/rsvp` (Protected)
* Response: Success message (for canceling an RSVP).

### Final Instructions

1.  Generate the complete code for **all files** in the directory structure.
2.  Ensure the `application.properties` file is configured for a MySQL database named `eventdb`.
3.  The frontend JavaScript must be clean, use `async/await` with `fetch`, and correctly handle the JWT auth flow (redirect to `index.html` if no token is found on `dashboard.html`).
4.  The CSS must strictly follow the "Modern & Minimalist" design brief.