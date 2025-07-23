Express + TypeScript CRUD API with In-Memory Storage
This is a basic REST API built with Express and TypeScript that demonstrates how to implement CRUD (Create, Read, Update, Delete) operations on user data using in-memory storage. It showcases a simple but efficient way to manage and query data using JavaScript Map objects for fast lookups by different keys such as id, email, and name.

Features
Basic Create, Read, Update, Delete endpoints for users.

In-memory storage synced asynchronously to a JSON file.

Fast data retrieval using multiple indexed Maps.

Validates email format and password complexity (uppercase, lowercase, number, min 6 chars).

Passwords hashed securely with bcryptjs.

Search users by keyword in name, email, or role via regex.

Fully typed with TypeScript for safety and clarity.

How It Works
MemoryUserStorage class manages users in an array plus lookup maps.

Updates persist asynchronously to disk.

REST endpoints provide:

POST /api/users/create — create user

GET /api/users — list all users

GET /api/users/:id — get user by ID

GET /api/users/search?q=keyword — search users

POST /api/users/:id/update — update user

POST /api/users/:id/delete — delete user

Why Maps?
Maps provide O(1) average lookup time by keys, making queries efficient even with larger datasets.

Getting Started
Clone repo and install dependencies with npm install.

Run the app using npm start (or ts-node).

Test API with your preferred REST client.

