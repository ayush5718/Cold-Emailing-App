# MERN Authentication System

A full-stack authentication system built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring secure user authentication and modern UI design.

## 🚀 Features

- User Registration with Email Verification
- Secure Login with JWT Authentication
- MongoDB Atlas Cloud Database Integration
- Modern UI with Tailwind CSS & Framer Motion
- Toast Notifications for User Feedback
- Protected Routes & Authorization
- Input Validation & Error Handling
- Responsive Design

## 🛠️ Technologies Used

### Frontend
- React.js
- Redux Toolkit (State Management)
- React Router v6
- Tailwind CSS
- Framer Motion
- React Hot Toast
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for Authentication
- Bcrypt for Password Hashing
- Joi for Validation
- Nodemailer for Email Services

## 📦 Installation & Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/mern-auth.git
cd mern-auth
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Environment Variables Setup

Create a `.env` file in the server directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_email_app_password
```

4. Start the development servers

```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from client directory)
npm run dev
```

## 🌐 API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

## 🔒 Security Features

- Password Hashing with Bcrypt
- JWT Token Authentication
- HTTP-Only Cookies
- Input Validation & Sanitization
- Protected API Routes
- Email Verification
- Rate Limiting

## 📱 UI Features

- Responsive Design
- Loading States
- Form Validation
- Error Handling
- Toast Notifications
- Smooth Animations
- Dark Mode Support (Coming Soon)

## 🔧 Development

### Frontend Structure
```
client/
├── src/
│   ├── components/    # Reusable components
│   ├── pages/        # Page components
│   ├── redux/        # Redux store and slices
│   ├── utils/        # Utility functions
│   └── App.jsx       # Main app component
```

### Backend Structure
```
server/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
└── utils/          # Utility functions
```

## 🚦 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_jwt_secret
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email
MAIL_PASS=your_app_password
```

## 👤 Author

**Aayush Kumar**
- Email: ayushbhardwaj9504@gmail.com
- GitHub: [Your GitHub Profile]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](issues).

## 🌟 Show your support

Give a ⭐️ if this project helped you!

## 📝 Notes

- Make sure to have MongoDB installed locally or use MongoDB Atlas
- Node.js version 14+ is recommended
- Use a secure JWT secret in production
- Configure email service properly for password reset functionality
