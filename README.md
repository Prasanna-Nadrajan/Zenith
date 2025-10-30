# 🎟️ Event Code App 🚀

A simple, intermediate-level full-stack web application built with Java Spring Boot and vanilla JavaScript.

This app allows users to host events and share a unique code for attendees to register, rather than having a public browsing page.

---

## ✨ Core Features

👤 User System: Simple login/signup with Email & Name.

🎟️ Unique Event Codes: The app's core! Hosts create an event and get a unique, shareable code (e.g., EVT-X4T9).

📝 Detailed Event Creation: Hosts can create events with details like:

---

## Title

1]Description

2]Event Date & Time

3]Location (with an "Online" option)

✅ Attendee Registration: Users can register for any event only by entering its unique code.

📊 Host Dashboard: Hosts can see all events they've created in a clean list.

👀 View Attendees: Hosts can see a list of who (Name & Email) has registered for each of their events.

🗑️ Delete Events: Hosts can easily delete events they created by mistake.

📋 Attendee Dashboard: Users can see a list of all events they are attending.

---

## 🌊 How It Works (User Flow)

Sign Up: A new user signs up with their Name & Email. 🧑‍💻

Create (Host): The user (as a Host) fills out the "Create Event" form with all the details. 📝

Get Code: The backend saves the event and returns a unique code (e.g., EVT-K9D2). 🎟️

Share: The Host shares this code with friends (via email, text, Slack, etc.). 💬

Register (Attendee): A friend logs in, enters the code EVT-K9D2 in the "Register" form, and is now an attendee! ✅

Manage (Host): The Host can now click "View Attendees" on their event and see their friend's name on the list. 📋

Delete (Host): If the event is canceled, the Host can click "Delete" to remove it. 🗑️

---

## 🛠️ Tech Stack

Frontend: 🖥️ HTML5, 🎨 CSS3, 💡 JavaScript (ES6+)

Backend: ☕ Java 17, 🌱 Spring Boot

Database: 🐬 MySQL

---

## 🚀 Getting Started

Clone the repo:
~~~
git clone https://github.com/Prasanna-Nadrajan/Zenith.git
~~~


Configure the Backend (in /backend):

Open src/main/resources/application.properties.

Update the spring.datasource.username and spring.datasource.password with your local MySQL credentials.

Make sure you have a database created (e.g., CREATE DATABASE eventdb;).

Run the Spring Boot application (e.g., via mvn spring-boot:run or your IDE).

Launch the Frontend (in /frontend):

Open the index.html file in your browser. Using a tool like VS Code's "Live Server" extension is recommended.

---

## 🔌 API Endpoints (Simplified)

POST /api/login-or-signup - Creates or logs in a user.

POST /api/events - Creates a new event (and returns it with the event code).

POST /api/register - Registers the logged-in user for an event using its code.

GET /api/events/hosted?userId=... - Gets all events a user is hosting.

GET /api/events/attending?userId=... - Gets all events a user is attending.

GET /api/events/{id}/attendees - Gets the list of users attending a specific event.

DELETE /api/events/{id} - Deletes a specific event (must be the host).
