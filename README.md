# UniTrade 🎓

> **The exclusive peer-to-peer marketplace for IIIT Bhubaneswar students.**  
> Buy, sell, and trade goods. Report lost & found items. Chat directly with sellers — all within a verified campus community.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Features](#-features)
  - [Authentication](#-authentication--user-management)
  - [Marketplace](#-marketplace--product-listings)
  - [Direct Messaging (Chat)](#-direct-messaging-chat)
  - [Lost & Found](#-lost--found)
  - [User Profile](#-user-profile)
  - [Contact & Developer Page](#-contact--developer-page)
- [API Reference](#-api-reference)
- [Database Models](#-database-models)
- [Security](#-security)

---

## 🌐 Overview

**UniTrade** is a full-stack web application built exclusively for students of **IIIT Bhubaneswar**. It provides a trusted, campus-verified platform where students can:

- **List and discover products** for sale from fellow students
- **Chat directly with sellers** before making a purchase
- **Report lost or found items** and connect with their rightful owners
- **Verify identity** through institutional email (`@iiit-bh.ac.in`) and Google OAuth

The platform emphasises trust and safety by restricting access to verified college email addresses only.

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP requests |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Pre-built component library (Button, Card, Dialog, etc.) |
| **Lucide React** | Icon library |
| **@react-oauth/google** | Google OAuth 2.0 integration |
| **Vite** | Build tool & dev server |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **MongoDB + Mongoose** | Database & ODM |
| **JSON Web Tokens (JWT)** | Stateless authentication |
| **bcryptjs** | Password hashing |
| **Multer** | File/image uploads |
| **Nodemailer** | Email delivery (OTP, welcome, contact) |
| **google-auth-library** | Google token verification |
| **dotenv** | Environment variable management |

---

## 📁 Project Structure

```
UniTrade/
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT protect middleware
│   ├── models/
│   │   ├── User.js                # User schema & password hashing
│   │   ├── Product.js             # Product listing schema
│   │   ├── LostFound.js           # Lost & Found item schema
│   │   ├── Message.js             # Chat message schema
│   │   └── OTP.js                 # One-time password schema
│   ├── routes/
│   │   ├── auth.js                # Register, login, Google OAuth, profile
│   │   ├── products.js            # CRUD for marketplace products
│   │   ├── lostFound.js           # Lost & Found reporting & claiming
│   │   ├── messages.js            # Chat / direct messaging
│   │   └── contact.js             # Contact form email delivery
│   ├── utils/
│   │   └── email.js               # Nodemailer helper functions
│   ├── uploads/                   # Uploaded product & L&F images
│   ├── seed.js                    # Database seeding script
│   ├── server.js                  # Express app entry point
│   └── .env                       # Environment variables (not committed)
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Home.jsx           # Marketplace product listing page
        │   ├── Login.jsx          # Login page (email + Google)
        │   ├── Signup.jsx         # Signup page with OTP verification
        │   ├── Profile.jsx        # User profile, shop stats, chats
        │   ├── Chat.jsx           # Real-time direct messaging UI
        │   ├── LostFound.jsx      # Lost & Found board
        │   ├── AddProduct.jsx     # List a new product form
        │   └── Developer.jsx      # Developer info & contact form
        ├── utils/
        │   └── studentInfo.js     # Helper to parse batch/dept from email
        ├── App.jsx                # Route definitions
        └── index.css              # Global styles & Tailwind imports
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB** (local or MongoDB Atlas)
- **Gmail account** with an [App Password](https://support.google.com/accounts/answer/185833) for email delivery

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/UniTrade.git
cd UniTrade
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file (see [Environment Variables](#-environment-variables) below), then start:
```bash
node server.js
# Server runs on http://localhost:5000
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

### 4. Seed the Database (Optional)
Populate the database with demo users, products, and lost & found items:
```bash
cd backend
node seed.js
```

---

## 🔐 Environment Variables

Create `backend/.env` with the following keys:

```env
# MongoDB connection string
MONGO_URI=mongodb://localhost:27017/unitrade

# JWT secret key (use a long, random string in production)
JWT_SECRET=your_jwt_secret_here

# JWT expiry duration
JWT_EXPIRES_IN=30d

# Google OAuth Client ID (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Gmail credentials for sending emails (use an App Password, not your real password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=yourapppaswordhere

# Server port
PORT=5000
```

---

## ✨ Features

---

### 🔐 Authentication & User Management

UniTrade uses a **dual authentication** system to guarantee all users are verified IIIT Bhubaneswar students.

#### OTP Email Verification Signup
1. User enters their `@iiit-bh.ac.in` email address.
2. The backend validates the email domain — **non-college emails are rejected at the API level.**
3. A 6-digit OTP is generated, stored in MongoDB with a TTL (auto-expires), and sent via Nodemailer to the student's inbox.
4. The user enters the OTP on the frontend.
5. Upon successful verification, the account is created, the OTP record is deleted, and a **JWT token** is issued.
6. A welcome email is sent to the new user.

#### Google Sign-In / Sign-Up
- Users can sign in using their **Google account**.
- The backend verifies the Google ID token using `google-auth-library`.
- **Domain restriction enforced**: only accounts with `@iiit-bh.ac.in` Google Workspace email are accepted. Personal Gmail accounts are rejected.
- On first sign-in, a new user account is auto-created. On subsequent sign-ins, the existing account is retrieved.
- A JWT token is issued regardless of the path.

#### Standard Email / Password Login
- Existing users can log in with email and password.
- Password is verified using **bcrypt** secure comparison.
- A JWT token is returned and stored in `localStorage` on the frontend.

#### Token-Based Session
- All protected API routes require a valid JWT in the `Authorization: Bearer <token>` header.
- The `authMiddleware.js` decodes and validates the token, attaching the `user` object to the request.

---

### 🛍 Marketplace & Product Listings

The **Home page** is the core of UniTrade — a filterable, searchable grid of items listed for sale by students.

#### Browsing Products
- All **unsold** products are displayed in a responsive 3-column grid.
- Each product card shows: image, name, price, category, age (months old), and the seller's name.
- Products are sorted by **newest first**.
- A **category filter** bar allows users to browse by: Electronics, Books, Furniture, Clothing, or Other.
- A **search bar** filters products in real-time by name.

#### Listing a Product (`/add-product`)
- Logged-in users can list items for sale by providing:
  - **Name** — product title
  - **Description** — detailed condition and features
  - **Price** — in Indian Rupees (₹)
  - **Category** — one of the predefined categories
  - **Condition** — how many months old the item is
  - **Image** — uploaded directly from device (stored in `backend/uploads/`)
- The product is associated with the logged-in user as its `owner`.

#### Chat with Seller
- Every product card has a **"Chat with Seller"** button.
- Clicking it redirects to `/chat/<sellerId>` — a dedicated chat window.
- **Self-chat prevention**: if the logged-in user is the product owner, a warning message is shown instead.

#### Mark as Sold
- Product owners can mark their listing as sold via the API (`PATCH /api/products/:id/sell`).
- Sold products are automatically hidden from the marketplace listing.

---

### 💬 Direct Messaging (Chat)

UniTrade includes a **built-in messaging system** that allows buyers and sellers to communicate directly — no need for phone numbers or external apps.

#### How it Works
- Clicking "Chat with Seller" (on a product) or "Chat" (on a Lost & Found item) navigates to `/chat/:userId`.
- The chat window fetches all historical messages between the two users from the backend.
- New messages can be sent via the input bar at the bottom.
- The chat **auto-polls every 3 seconds** for new messages, providing a near-real-time experience without requiring WebSockets.
- Messages scroll to the bottom automatically as they arrive.

#### Chat UI
- **Your messages** appear on the right in a dark slate bubble.
- **Their messages** appear on the left in a white card.
- Each message has a timestamp.
- The header displays the other person's **name** and **profile photo**, fetched from the database.
- A "Security Protocol Established" badge reassures users that both parties are campus-verified.

#### Accessing All Conversations
- The **Profile page** includes a **"Messages"** section that lists all recent conversations.
- Each conversation shows the partner's avatar, name, and the last message preview.
- Clicking a conversation opens the chat window for that user.
- The **header** on all pages includes a quick-access **Messages icon button** (📩) that navigates to the Profile page.

#### API Endpoints
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/messages/:otherUserId` | Fetch all messages between current user and another user |
| `POST` | `/api/messages` | Send a new message |
| `GET` | `/api/messages/conversations/recent` | Get recent conversation list for the logged-in user |

---

### 🔍 Lost & Found

The **Lost & Found** board (`/lost-found`) is a community feature that helps students recover lost items or return found ones.

#### Reporting an Item
- Any logged-in user can report an item by clicking **"Report Item"**.
- A dialog form collects:
  - **Type**: "I Lost Something" or "I Found Something"
  - **Category**: Electronics, Books, Identification, Keys, Clothing, Accessories, or Other
  - **Item Name**, **Location**, and **Description**
  - **Photo** (optional) — uploaded from device
- The item is stored with `status: 'active'` and linked to the reporter.

#### Browsing Items
- Items are displayed in a card grid, each showing: image, type badge (LOST / FOUND), category, title, location, and date.
- A **filter bar** lets users view All Items, Lost Items only, or Found Items only.

#### Chat with Reporter
- Each active item has a **chat icon button** that opens a direct message conversation with the person who reported the item.
- This allows users to verify details (e.g., "I found your black backpack near the library") before officially claiming.
- **Self-chat prevention**: reporters cannot open a chat with themselves.

#### Claiming an Item
- Users who believe an item is theirs (or have found a reported lost item) can click **"Claim"**.
- A verification dialog asks for a **unique description** to prove ownership (e.g., serial number, specific wallpaper, scratch marks).
- The claim note is saved, and the item's status changes to `'claimed'`.
- Claimed items display a green "SECURED BY OFFICE" badge — meaning the user should collect it from the Lost & Found department desk.

---

### 👤 User Profile

The **Profile page** (`/profile`) is a comprehensive dashboard for each student.

#### Profile Section
- Displays the user's **full name**, **email** (Campus ID), and **Department** (inferred from their email).
- A large **avatar** shows their profile photo (or initials as fallback).
- A camera icon button allows **uploading a new profile photo** directly. The image is uploaded to the server and the URL is stored in the database.
- A **"Verified Identity"** badge confirms the account is tied to a real college email.

#### Academic Info Cards
- **Enrollment Batch**: The year the student enrolled (derived from their email ID, e.g., `bt22` → Batch 2022).
- **Academic Year**: The current year of study (calculated as `current year - enrollment year`).

#### My Shop (Marketplace Activity)
- Shows a stats grid: **Active Listings**, **Sold Items**, Views (future), and Rating (future).
- A prominent call-to-action card shows how many active items the user has and a button to list more.

#### Messages (Recent Conversations)
- A dynamic list of all recent chat conversations.
- Each entry shows the **partner's avatar**, **name**, and **last message preview** with a timestamp.
- Clicking any entry opens that conversation's chat window.

---

### 📬 Contact & Developer Page

#### Developer Page (`/developer`)
- A professionally designed page introducing the developer of UniTrade.
- Includes social profile links: **GitHub**, **LinkedIn**, **Twitter**, **LeetCode**.
- A **"Send Message"** dialog allows anyone to fill out a contact form with a name, email, and message, which is delivered directly to the developer's inbox via Nodemailer.

#### Contact Form Backend (`/api/contact`)
- Receives `name`, `email`, and `message` from the frontend.
- Sends a beautifully styled HTML email to the developer using Gmail SMTP.
- The email template uses the dark slate-and-emerald "Architect" colour scheme matching the developer page.

---

## 📡 API Reference

All endpoints are prefixed with `http://localhost:5000/api`.  
Protected routes require `Authorization: Bearer <JWT_TOKEN>` header.

### Auth (`/api/auth`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/send-otp` | ❌ | Send OTP to college email |
| `POST` | `/signup` | ❌ | Create account with OTP verification |
| `POST` | `/login` | ❌ | Login with email + password |
| `POST` | `/google` | ❌ | Login / signup via Google OAuth |
| `GET` | `/me` | ✅ | Get current user's full profile |
| `PATCH` | `/update-photo` | ✅ | Upload & update profile photo |
| `GET` | `/:id` | ❌ | Get public info (name, photo) for any user by ID |

### Products (`/api/products`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | ❌ | Get all unsold products |
| `GET` | `/my-products` | ✅ | Get current user's listings |
| `POST` | `/` | ✅ | Create a new product listing |
| `PATCH` | `/:id/sell` | ✅ | Mark a product as sold |

### Lost & Found (`/api/lost-found`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | ❌ | Get all lost & found items |
| `POST` | `/` | ✅ | Report a new lost or found item |
| `PATCH` | `/:id/claim` | ✅ | Claim an item (triggers status change) |

### Messages (`/api/messages`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/:otherUserId` | ✅ | Get all messages between two users |
| `POST` | `/` | ✅ | Send a message (`receiverId`, `text` in body) |
| `GET` | `/conversations/recent` | ✅ | Get list of recent conversations |

### Contact (`/api/contact`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/` | ❌ | Send a contact email to the developer |

---

## 🗄 Database Models

### `User`
| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `email` | String | Unique; must end with `@iiit-bh.ac.in` |
| `password` | String | Hashed with bcrypt (12 rounds); hidden from queries |
| `role` | String | `'student'` or `'admin'`; default `'student'` |
| `profilePhoto` | String | URL to uploaded image or external URL |
| `createdAt` | Date | Auto set on creation |

### `Product`
| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `description` | String | Required |
| `price` | Number | Required |
| `image` | String | URL; required |
| `condition` | Number | Months old |
| `category` | String | Enum: Electronics, Books, Furniture, Clothing, Other |
| `owner` | ObjectId | Ref: `User` |
| `isSold` | Boolean | Default `false` |

### `LostFound`
| Field | Type | Notes |
|---|---|---|
| `title` | String | Required |
| `description` | String | Required |
| `type` | String | `'lost'` or `'found'` |
| `category` | String | Enum of 7 categories |
| `location` | String | Where it was lost/found |
| `image` | String | Optional URL |
| `reporter` | ObjectId | Ref: `User` |
| `status` | String | `'active'` or `'claimed'`; default `'active'` |
| `claimedBy` | ObjectId | Ref: `User` — set on claim |
| `claimNote` | String | Description provided by claimer |

### `Message`
| Field | Type | Notes |
|---|---|---|
| `sender` | ObjectId | Ref: `User`; required |
| `receiver` | ObjectId | Ref: `User`; required |
| `text` | String | Required; the message body |
| `productId` | ObjectId | Ref: `Product`; optional context |
| `isRead` | Boolean | Default `false` |
| `createdAt` | Date | Auto set on creation |

### `OTP`
| Field | Type | Notes |
|---|---|---|
| `email` | String | College email the OTP was sent to |
| `otp` | String | 6-digit code |
| `createdAt` | Date | TTL index — expires automatically |

---

## 🔒 Security

- **Domain restriction**: API-level validation ensures only `@iiit-bh.ac.in` emails can register. Enforced on the backend regex, not just the frontend.
- **OTP expiry**: OTP records are stored with a TTL and deleted on successful use, preventing replay attacks.
- **Password security**: Passwords are pre-hashed with bcrypt (12 salt rounds) before being stored. Raw passwords are never saved.
- **JWT authentication**: All protected routes verify a signed JWT. Tokens have a configurable expiry (`JWT_EXPIRES_IN`).
- **Google domain check**: The Google OAuth flow checks the `hd` (hosted domain) claim in the token to confirm the account belongs to the college Google Workspace.
- **File uploads**: Images are stored locally in `uploads/`. Only image MIME types are accepted via Multer.
- **Self-chat prevention**: The chat system prevents users from messaging themselves, enforced on the frontend.

---

## 🧑‍💻 Developer

Built by **Siddhant Srivastav**  
IIIT Bhubaneswar

- GitHub: [github.com/Siddhant295](https://github.com/Siddhant295)
- LinkedIn: [linkedin.com/in/siddhant-srivastav](https://linkedin.com/in/siddhant-srivastav)
- LeetCode: [leetcode.com/u/sid_295](https://leetcode.com/u/sid_295/)

---

## 📄 License

This project is intended for internal academic use at IIIT Bhubaneswar.  
© 2025 Siddhant Srivastav. All rights reserved.
