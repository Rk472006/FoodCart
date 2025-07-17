# 🛒 FoodCart

A full-featured **MERN stack food delivery web application** with user authentication, cart management, real-time order summary, and checkout flow. Each user has a separate cart and personalized experience with seamless integration between frontend and backend.

![React](https://img.shields.io/badge/Frontend-React-blue)
![Firebase](https://img.shields.io/badge/Auth-Firebase-orange)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Express](https://img.shields.io/badge/Backend-Express-black)
![Node.js](https://img.shields.io/badge/Server-Node.js-lightgrey)

---

## ✨ Features

- ✅ **Firebase Authentication** (Login & Register)
- ✅ **Each user has a separate cart** (linked by userId)
- ✅ **Add to Cart** from product cards
- ✅ **Real-Time Cart Updates** from MongoDB
- ✅ **Checkout Page** with delivery form
- ✅ **Place Order Functionality**
- ✅ **Order Summary** for each user
- ✅ **Favorites** (save preferred dishes)
- ✅ **Feedback Submission** after order
- ✅ **Efficient MongoDB indexing** (userId, productId for performance)

---

## 🚀 Tech Stack

| Layer             | Tech Stack                                     |
|-------------------|------------------------------------------------|
| **Frontend**      | React, CSS Modules, Axios, React Router        |
| **Backend**       | Node.js, Express.js                            |
| **Database**      | MongoDB with Mongoose                          |
| **Authentication**| Firebase Authentication                        |
| **Storage**       | Multer (Image Uploads)                         |

---

## 📂 Folder Structure

```bash
FoodCart/
├── client/                     # React frontend
│   ├── components/             # Reusable UI components (e.g., ProductCard)
│   ├── admin/                  # Admin pages (Dashboard, Product Mgmt, Orders)
│   ├── auth/                   # Login, Register, Protected Routes
│   └── user/                   # User pages (Home, Cart, Checkout, Favorites)
│
├── server/                     # Node.js + Express backend
│   ├── models/                 # Mongoose models (User, Product, Cart, Order)
│   ├── routes/                 # API endpoints (Auth, Products, Cart, Orders)
│   ├── utils/                  # Cloudinary and Firebase Admin configs
│   └── middleware/             # Auth guards, validation, error handling
│
└── README.md                   # Project documentation
