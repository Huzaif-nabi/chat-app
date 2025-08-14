# MERN Chat App

![MERN](https://img.shields.io/badge/Stack-MERN-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

A real-time chat application built using the **MERN stack** (MongoDB, Express, React, Node.js).  

---

## Features

- Real-time messaging
- Cloud image uploads using Cloudinary
- JWT-based authentication
- Fully customizable `.env` configuration  

## File Structure

chat-app/
├── client/ # React frontend
└── server/ # Node.js + Express backend


---

## Environment Variables

This project does **not include `.env` files**, so anyone cloning the repo must create their own.  

### **Client (`client/.env`)**
```env
VITE_BACKEND_URL=''
VITE_CLOUDINARY_CLOUD_NAME=''
VITE_CLOUDINARY_UPLOAD_PRESET=''

### **Server (`server/.env`)**
```env
MONGODB_URI=""
PORT=
JWT_SECRET=""

CLOUDINARY_CLOUD_NAME=''
CLOUDINARY_API_KEY=''
CLOUDINARY_SECRET=''

Installation
Clone the repository:
git clone <your-repo-url>
cd chat-app

Install dependencies for both frontend and backend:
cd client
npm install
cd ../server
npm install

Running the App
client npm run dev
server npm run dev

Notes

Make sure MongoDB is accessible using your connection URI.
Ensure Cloudinary credentials are correct for image uploads.
JWT secret should be kept secure in production.

