# Freelancer Project Hub

A full-stack freelance collaboration platform built with the **MERN stack**.  
It centralizes project posting, proposals, contracts, tasks, file sharing, real-time chat, and payments—providing a single workspace for clients and freelancers.

**Live Demo:** [freelancerprojecthub.vercel.app](https://freelancerprojecthub.vercel.app)

---

## 📌 Features

### Authentication & Roles
- JWT-based authentication
- Two roles: **Client** and **Freelancer**

### Project Lifecycle
- Clients post projects with descriptions and budgets
- Freelancers submit proposals with custom bids
- Clients accept proposals → project assigned + budget updated

### Project Workspace
- Private space for each project (only client + freelancer)
- **Kanban Task Board** (Todo, In Progress, Done)
- File uploads via **Cloudinary**
- Billing & Payment tab for invoices

### Payments
- **Stripe API** integration
- Secure webhook-driven payment confirmations

### Communication & Notifications
- Real-time project chat (**Socket.IO**)
- Direct messaging
- Notifications (messages, connection requests, project updates)

### Profiles & Reputation
- Editable LinkedIn-style profiles (Bio, Skills, Experience, Education)
- Profile pictures stored in **Cloudinary**
- Review & rating system for both clients and freelancers

### Social Features
- Home feed for posts (text + job postings)
- Likes & comments
- User connections (send/accept/decline requests)
- Hashtags linked to search

### UI/UX
- Built with **Tailwind CSS**
- Fully responsive across devices

---

## 🛠 Tech Stack

- **Frontend:** React, Vite, React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **Real-time:** Socket.IO
- **Payments:** Stripe
- **File Storage:** Cloudinary
- **Authentication:** JSON Web Tokens (JWT)
- **Deployment:** Vercel (frontend), AWS EC2 + Nginx + PM2 (backend)

---

## 📂 Project Structure

freelancerProjectHub/
├── client/ # Frontend (React + Tailwind)
│ ├── public/ # Static assets
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Page views
│ │ ├── context/ # Auth & global state
│ │ ├── services/ # API calls & socket
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── package.json
├── server/ # Backend (Node.js + Express + MongoDB)
│ ├── config/ # DB, cloudinary, stripe configs
│ ├── controllers/ # Business logic
│ ├── middleware/ # Auth & error handlers
│ ├── models/ # MongoDB schemas
│ ├── routes/ # API routes
│ ├── utils/ # Helper functions
│ ├── server.js # Entry point
│ └── package.json
└── README.md # Project Documentation

text

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js (>= 16) and npm
- MongoDB (local or Atlas)
- Cloudinary account
- Stripe account

---

### 1. Clone the repository

git clone https://github.com/your-username/freelancerProjectHub.git
cd freelancerProjectHub

text

---

### 2. Backend Setup

cd server
npm install
cp .env.example .env # Copy example env and update credentials

text

Update `.env` with your credentials:

PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

text

Start the backend server:

npm run dev

text

---

### 3. Frontend Setup

cd client
npm install
cp .env.example .env # Copy example env and update values

text

Update `.env` with your values:

VITE_API_BASE_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

text

Run the frontend:

npm run dev

text

---

## 🌐 Deployment

### Backend (AWS EC2 + Nginx + PM2)

SSH into EC2 instance:

ssh -i your-key.pem ubuntu@your-ec2-ip

text

Install Node.js & PM2:

sudo apt update
sudo apt install -y nodejs npm
sudo npm install -g pm2

text

Clone repo & setup backend:

git clone https://github.com/your-username/freelancerProjectHub.git
cd freelancerProjectHub/server
npm install
cp .env.example .env # update with prod values
pm2 start server.js

text

---

### Frontend (Vercel or Nginx)

#### For Vercel:  
Deploy `/client` directly.

#### For Nginx on EC2:

Build the frontend:

cd client
npm install
npm run build

text

Update Nginx config (example):

server {
server_name freelancerproject.duckdns.org;

text
location / {
    root /home/ubuntu/freelancerProjectHub/client/dist;
    index index.html;
    try_files $uri /index.html;
}

location /api {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
}

text

Reload Nginx:

sudo systemctl restart nginx

text

---

## 🧑‍💻 Contributing

- Fork the repo
- Create a new branch (e.g. `feature/my-feature`)
- Commit changes (`git commit -m "Added new feature"`)
- Push branch (`git push origin feature/my-feature`)
- Open a Pull Request

---

## 👤 Author

Kande Vishnu

- GitHub: [@kandevishnu](https://github.com/kandevishnu)
- LinkedIn: [Your LinkedIn URL]

---

## 📜 License

This project is licensed under the MIT License.