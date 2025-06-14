# Mini Social Feed API

A simple RESTful API for a social feed application built with Node.js, Express, MongoDB, and JWT authentication. This API supports user registration, login, profile management, post creation (with image upload), and post management with pagination. Swagger documentation is included.

## Features

- User registration with profile image upload
- User login with JWT authentication
- Get current user profile
- Create, read, update, and delete posts (CRUD)
- Upload images for posts
- Pagination for posts listing
- API responses with consistent structure
- Swagger API documentation

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- Multer (file uploads)
- Swagger (API docs)
- dotenv (environment variables)
- CORS

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/TariqMehmood1004/Mini-Social-Feed-API-FAST-APIs---MERN-APP.git
    cd Mini-Social-Feed-API-FAST-APIs---MERN-APP
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Copy `.env.example` to `.env` and fill in your environment variables:
    ```sh
    cp .env.example .env
    ```

    - : MongoDB connection string
    - : Secret for JWT signing
    - : Port to run the server (default: 5000)
    - : Host URL (default: http://127.0.0.1)
    - : API version prefix (default: api/v1)

4. Start the server:
    ```sh
    npm run dev
    ```

## API Documentation

Swagger UI is available at:  
[http://localhost:5000/api-docs](http://localhost:5000/api-docs)

## Folder Structure

├── Helpers/ 
│ └── ApiResponseHandler.js 
├── middleware/ 
|   └── verifyToken.js 
├── models/ 
│   ├── Post.js 
│   └── User.js 
├── routes/ 
│   ├── auth.js 
│   └── posts.js 
├── uploads/ 
│   ├── posts/ 
│   └── profiles/ 
├── server.js 
├── swagger.js 
├── package.json 
├── .env.example 
└── README.md

## Endpoints Overview

### Auth

- `POST /api/v1/auth/register` — Register a new user (with profile image)
- `POST /api/v1/auth/login` — Login and receive JWT token
- `GET /api/v1/auth/me` — Get current user profile (requires JWT)

### Posts

- `POST /api/v1/posts/` — Create a new post (with image, requires JWT)
- `GET /api/v1/posts/` — List all posts (supports pagination)
- `GET /api/v1/posts/:id` — Get a specific post by ID
- `PUT /api/v1/posts/:id` — Update a post (requires JWT, only owner)
- `DELETE /api/v1/posts/:id` — Delete a post (requires JWT, only owner)

## Environment Variables

See [.env.example](http://_vscodecontentref_/5) for all required variables.

## License

This project is licensed under the ISC License.

---

**Author:**  
Tariq Mehmood