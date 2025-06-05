const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const session = require('express-session');
const { createClient } = require('redis');
const { RedisStore } = require('connect-redis');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const server = http.createServer(app);

// Setup Redis client
let redisClient;

if (process.env.NODE_ENV === 'production') {
  // For production, use the Redis URL from environment variable
  redisClient = createClient({
    url: process.env.REDIS_URL
  });
} else {
  // For development, use the Redis URL from env or default
  redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });
}

// Initialize Redis connection
redisClient.connect().catch(err => console.error('Redis connection error:', err));
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

// Initialize RedisStore - Connect Redis v8
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "referease:"
});

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure session middleware
app.use(session({
  store: redisStore,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true in production
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Add security headers
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// Socket.io configuration
const io = socketIo(server, {
  cors: corsOptions
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/referrease', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/referrals', require('./routes/referrals'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/google', require('./routes/google'));

// Serve static files from the React app
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
} else {
  // In development, proxy requests to the React dev server
  app.get('*', (req, res) => {
    res.redirect(process.env.CLIENT_URL || 'http://localhost:3000');
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 