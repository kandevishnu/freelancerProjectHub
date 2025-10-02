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
│── client/ # Frontend (React + Tailwind)
│── server/ # Backend (Node.js + Express + MongoDB)
│── README.md # Project Documentation

yaml
Copy code

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

```bash
git clone https://github.com/your-username/freelancerProjectHub.git
cd freelancerProjectHub
2. Backend Setup
bash
Copy code
cd server
npm install
Copy the example environment file:

bash
Copy code
cp .env.example .env
Update .env with your credentials:

env
Copy code
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
Start the backend server:

bash
Copy code
npm run dev
3. Frontend Setup
bash
Copy code
cd client
npm install
Copy the example environment file:

bash
Copy code
cp .env.example .env
Update .env with your values:

env
Copy code
VITE_API_BASE_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
Run the frontend:

bash
Copy code
npm run dev
🌐 Deployment
Backend (AWS EC2 + Nginx + PM2)
SSH into EC2 instance:

bash
Copy code
ssh -i your-key.pem ubuntu@your-ec2-ip
Install Node.js & PM2:

bash
Copy code
sudo apt update
sudo apt install -y nodejs npm
sudo npm install -g pm2
Clone repo & setup backend:

bash
Copy code
git clone https://github.com/your-username/freelancerProjectHub.git
cd freelancerProjectHub/server
npm install
cp .env.example .env  # update with prod values
pm2 start server.js
Frontend (Vercel or Nginx)
For Vercel: Deploy /client directly.

For Nginx on EC2:

bash
Copy code
cd client
npm install
npm run build
Update Nginx config:

nginx
Copy code
server {
    server_name freelancerproject.duckdns.org;

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
Reload Nginx:

bash
Copy code
sudo systemctl restart nginx
🧑‍💻 Contributing
Fork the repo

Create a new branch (feature/my-feature)

Commit changes (git commit -m "Added new feature")

Push branch (git push origin feature/my-feature)

Open a Pull Request

👤 Author
Kande Vishnu

GitHub: @kandevishnu

LinkedIn: [Your LinkedIn URL]

📜 License
This project is licensed under the MIT License.

pgsql
Copy code

---

✅ This version is clean, complete, and professional — with `.env.example` usage, setup steps, deployment guide, and contribution guidelines.  

Do you also want me to **write the `.env.example` files for both frontend & backend** so contributors can directly copy them?






