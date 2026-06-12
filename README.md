# Student Attendance System API

A RESTful API for managing student attendance records, built with **Node.js**, **Express.js**, and **MongoDB**. Designed with a clean layered architecture — models, controllers, routes, and middleware — following professional development conventions.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
- [API Reference](#api-reference)
  - [Students](#students)
  - [Attendance](#attendance)
- [Error Handling](#error-handling)
- [Data Models](#data-models)
- [Design Decisions](#design-decisions)

---

## Overview

The Student Attendance System API provides a complete backend for tracking student attendance in an educational institution. It supports creating and managing student records, marking daily attendance, querying attendance by student or date, and updating or deleting records.

The system enforces business rules at the database level — a student cannot be marked twice on the same day — and returns consistent, predictable JSON responses across all endpoints.

---

## Architecture

The application is built in three distinct layers, each with a single responsibility:

```
HTTP Request
     │
     ▼
┌─────────────────────────────┐
│         Routes Layer        │  Maps URLs + HTTP methods to controllers
│  student.routes.js          │
│  attendance.routes.js       │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│      Controllers Layer      │  Handles req/res logic — the happy path
│  student.controller.js      │
│  attendance.controller.js   │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│        Models Layer         │  Defines data shape and enforces rules
│  student.model.js           │
│  attendance.model.js        │
└─────────────┬───────────────┘
              │
              ▼
         MongoDB
```

Errors at any layer are forwarded via `next(error)` to a centralised error middleware, keeping controllers clean and focused on the happy path only.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Node.js | v18+ | Runtime environment |
| Express.js | v4 | HTTP server and routing |
| MongoDB | v8 | Document database |
| Mongoose | v8 | ODM — schema definition and querying |
| dotenv | v16 | Environment variable management |
| cors | v2 | Cross-origin resource sharing |
| morgan | v1 | HTTP request logging |

---

## Project Structure

```
attendance-system/
├── config/
│   └── db.js                      # MongoDB connection
├── controllers/
│   ├── student.controller.js      # Student request/response logic
│   └── attendance.controller.js   # Attendance request/response logic
├── middleware/
│   ├── error.middleware.js        # Centralised error handler
│   └── notFound.middleware.js     # 404 handler for unknown routes
├── models/
│   ├── student.model.js           # Student Mongoose schema and model
│   └── attendance.model.js        # Attendance Mongoose schema and model
├── routes/
│   ├── student.routes.js          # Student route definitions
│   └── attendance.routes.js       # Attendance route definitions
├── .env                           # Environment variables (not committed)
├── .gitignore
├── package.json
└── server.js                      # Application entry point
```

---

## Getting Started

### Prerequisites

Ensure the following are installed on your machine:

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) v6 or higher (local) or a [MongoDB Atlas](https://www.mongodb.com/atlas) account

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/student_attendance_system_API.git
cd student_attendance_system_API
```

**2. Install dependencies**

```bash
npm install
```

### Environment Variables

Create a `.env` file at the root of the project. This file is never committed to version control.

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/student_attendanceDB
```

For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/student_attendanceDB?retryWrites=true&w=majority
```

### Running the Server

**Development**

```bash
node server.js
```

**With auto-restart on file changes (recommended for development)**

```bash
# Install nodemon globally if you haven't already
npm install -g nodemon

nodemon server.js
```

On successful startup you will see:

```
MongoDB connected: localhost
Server running on port 5000
```

---

## API Reference

All endpoints return JSON responses in the following consistent shape:

```json
// Success
{
  "success": true,
  "data": { }
}

// Error
{
  "success": false,
  "message": "Description of what went wrong"
}
```

### Students

#### Create a student

```
POST /api/students
```

**Request body**

```json
{
  "name": "Alice Muthoni",
  "studentId": "STU-001",
  "class": "Form 3A"
}
```

**Response `201 Created`**

```json
{
  "success": true,
  "data": {
    "_id": "684936c2a1b2c3d4e5f67890",
    "name": "Alice Muthoni",
    "studentId": "STU-001",
    "class": "Form 3A",
    "createdAt": "2026-06-11T08:00:00.000Z",
    "updatedAt": "2026-06-11T08:00:00.000Z"
  }
}
```

---

#### Get all students

```
GET /api/students
```

**Response `200 OK`**

```json
{
  "success": true,
  "count": 2,
  "data": [ ]
}
```

---

#### Get a single student

```
GET /api/students/:id
```

| Parameter | Type | Description |
|---|---|---|
| `id` | `string` | MongoDB ObjectId of the student |

**Response `200 OK`**

```json
{
  "success": true,
  "data": { }
}
```

---

#### Update a student

```
PUT /api/students/:id
```

**Request body** — send only the fields you want to update

```json
{
  "class": "Form 4A"
}
```

**Response `200 OK`**

```json
{
  "success": true,
  "data": { }
}
```

---

#### Delete a student

```
DELETE /api/students/:id
```

**Response `200 OK`**

```json
{
  "success": true,
  "data": {}
}
```

---

### Attendance

#### Mark attendance

```
POST /api/attendance
```

**Request body**

```json
{
  "studentId": "STU-001",
  "date": "2026-06-11",
  "status": "present"
}
```

| Field | Type | Allowed values |
|---|---|---|
| `studentId` | `string` | Any valid student ID e.g. `STU-001` |
| `date` | `string` | ISO date format `YYYY-MM-DD` |
| `status` | `string` | `present`, `absent`, `late` |

**Response `201 Created`**

```json
{
  "success": true,
  "data": {
    "_id": "684936c2a1b2c3d4e5f67891",
    "student": {
      "_id": "684936c2a1b2c3d4e5f67890",
      "name": "Alice Muthoni",
      "studentId": "STU-001",
      "class": "Form 3A"
    },
    "date": "2026-06-11T00:00:00.000Z",
    "status": "present",
    "createdAt": "2026-06-11T07:30:00.000Z",
    "updatedAt": "2026-06-11T07:30:00.000Z"
  }
}
```

---

#### Get attendance records

```
GET /api/attendance
GET /api/attendance?studentId=STU-001
GET /api/attendance?date=2026-06-11
GET /api/attendance?studentId=STU-001&date=2026-06-11
```

| Query parameter | Type | Description |
|---|---|---|
| `studentId` | `string` | Filter by student ID e.g. `STU-001` |
| `date` | `string` | Filter by date `YYYY-MM-DD` |

Both parameters are optional and can be combined. Omitting both returns all records sorted by date descending.

**Response `200 OK`**

```json
{
  "success": true,
  "count": 1,
  "data": [ ]
}
```

---

#### Update an attendance record

```
PUT /api/attendance/:id
```

Only `status` can be updated on an existing attendance record.

**Request body**

```json
{
  "status": "late"
}
```

**Response `200 OK`**

```json
{
  "success": true,
  "data": { }
}
```

---

#### Delete an attendance record

```
DELETE /api/attendance/:id
```

**Response `200 OK`**

```json
{
  "success": true,
  "data": {}
}
```

---

## Error Handling

All errors are handled by a single centralised error middleware (`middleware/error.middleware.js`). Controllers never handle errors directly — they forward them via `next(error)`.

| Error type | HTTP status | Cause |
|---|---|---|
| Validation error | `400` | Required field missing or invalid enum value |
| Duplicate key | `400` | Unique constraint violated e.g. duplicate `studentId` or same student marked twice on the same date |
| Cast error | `400` | Invalid MongoDB ObjectId format in URL params |
| Not found | `404` | Resource does not exist or route does not exist |
| Server error | `500` | Unexpected internal error |

**Example error response**

```json
{
  "success": false,
  "message": "Attendance already marked for this student on this date"
}
```

---

## Data Models

### Student

| Field | Type | Rules |
|---|---|---|
| `_id` | `ObjectId` | Auto-generated by MongoDB |
| `name` | `String` | Required, trimmed |
| `studentId` | `String` | Required, unique, uppercase, trimmed |
| `class` | `String` | Required, trimmed |
| `createdAt` | `Date` | Auto-managed by Mongoose |
| `updatedAt` | `Date` | Auto-managed by Mongoose |

### Attendance

| Field | Type | Rules |
|---|---|---|
| `_id` | `ObjectId` | Auto-generated by MongoDB |
| `student` | `ObjectId` | Required, references `Student` collection |
| `date` | `Date` | Required, normalised to midnight UTC |
| `status` | `String` | Required, enum: `present`, `absent`, `late` |
| `createdAt` | `Date` | Auto-managed by Mongoose |
| `updatedAt` | `Date` | Auto-managed by Mongoose |

**Compound unique index** on `{ student, date }` — enforces that one student can only have one attendance record per calendar day.

---

## Design Decisions

**Dot notation file naming** — files are named `resource.role.js` (e.g. `student.model.js`, `student.routes.js`). This makes the role of every file immediately clear when scanning the project.

**Normalised date storage** — attendance dates are normalised to midnight UTC using `setUTCHours(0, 0, 0, 0)` before saving. This ensures the compound unique index correctly detects duplicates regardless of what time of day attendance is marked.

**Centralised error handling** — all errors are forwarded via `next(error)` to a single error middleware. Controllers only handle the happy path. This keeps controller functions short, readable, and focused.

**Guaranteed startup order** — the server is wrapped in an `async start()` function that `await`s the database connection before calling `app.listen()`. This ensures no requests are accepted before the database is ready.

**Database-level constraints** — business rules (unique student IDs, one attendance record per student per day) are enforced at the MongoDB index level, not just in application code. This protects data integrity even against race conditions.

---

> Built with Node.js · Express.js · MongoDB · Mongoose
