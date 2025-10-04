# 💬 Chat App - MERN Stack Real-time Chat Application

A modern, responsive real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring Socket.io for instant messaging, user authentication, and cloudinary integration for image sharing.

![Chat App](https://img.shields.io/badge/MERN-Stack-green) ![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-blue) ![React](https://img.shields.io/badge/React-19.1.1-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)

## Features

- **Real-time Messaging**: Instant message delivery using Socket.io
- **User Authentication**: Secure JWT-based authentication system
- **Image Sharing**: Upload and share images using Cloudinary integration
- **Online Status**: See which users are currently online
- **Message Status**: Read receipts and message seen indicators
- **Responsive Design**: Modern UI built with Tailwind CSS
- **User Profiles**: Manage profile pictures and bio information
- **Search Functionality**: Find and connect with other users

## Tech Stack

### Frontend
- **React 19.1.1** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4.1.12** - Utility-first CSS framework
- **React Router DOM 7.8.2** - Client-side routing
- **Socket.io Client 4.8.1** - Real-time communication
- **Axios 1.11.0** - HTTP client for API calls
- **React Hot Toast 2.6.0** - Beautiful toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5.1.0** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 8.18.0** - MongoDB object modeling
- **Socket.io 4.8.1** - Real-time bidirectional communication
- **JWT (jsonwebtoken)** - Authentication tokens
- **Bcryptjs 3.0.2** - Password hashing
- **Cloudinary 2.7.0** - Image storage and optimization
- **CORS 2.8.5** - Cross-origin resource sharing

## Project Structure

```
chat-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ChatContainer.jsx
│   │   │   ├── RightSidebar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── context/        # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── ChatContext.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── assets/         # Static assets
│   │   └── lib/            # Utility functions
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── lib/               # Database and utility functions
│   └── server.js          # Main server file
└── chat-app-assets/       # Additional assets
```

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd chat-app
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017
   JWT_SECRET=your_jwt_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

### Running the Application

1. **Start the MongoDB service**
   - Local: Ensure MongoDB is running on your system
   - Atlas: Your connection string should be in the `.env` file

2. **Start the server**
   ```bash
   cd server
   npm run server  # Development mode with nodemon
   # or
   npm start       # Production mode
   ```

3. **Start the client** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```

4. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Messages
- `GET /api/messages/:receiverId` - Get messages with a specific user
- `POST /api/messages` - Send a new message
- `PUT /api/messages/seen` - Mark messages as seen

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update user profile

## Socket.io Events

### Client to Server
- `sendMessage` - Send a new message
- `markSeen` - Mark messages as seen

### Server to Client
- `newMessage` - Receive a new message
- `getonlineusers` - Get list of online users
- `messagesSeen` - Notification when messages are seen

## Features Overview

### Authentication System
- Secure user registration and login
- JWT token-based authentication
- Protected routes and middleware

### Real-time Chat
- Instant message delivery
- Online/offline user status
- Message read receipts
- Typing indicators (can be extended)

### Image Sharing
- Upload images via Cloudinary
- Optimized image delivery
- Support for various image formats

### User Interface
- Modern, responsive design
- Dark/light theme support
- Mobile-friendly interface
- Smooth animations and transitions

## Deployment

### Frontend (Vercel/Netlify)
1. Build the client: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Update API endpoints to production URLs

### Backend (Railway/Heroku/DigitalOcean)
1. Set environment variables in your hosting platform
2. Ensure MongoDB connection (Atlas recommended)
3. Deploy the server directory

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Socket.io for real-time communication
- MongoDB for database services
- Cloudinary for image management
- Tailwind CSS for styling
- React team for the amazing framework

## Support

If you have any questions or need help with the project, please open an issue or contact the maintainers.

---

**Happy Chatting! 💬**

## Thanks to GreatStack, for I learnt the process of Socket.io and other features listed above
