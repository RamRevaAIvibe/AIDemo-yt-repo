require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const todoRoutes = require('./routes/todos');

const app = express();

app.use(cors()); // open for development - restrict the origin for production
app.use(express.json());

// Connect to MongoDB once per serverless instance, then reuse the connection.
// On Vercel the function stays warm between requests, so this avoids a new
// database connection on every call.
let dbConnection;
function connectDB() {
  if (!dbConnection) {
    dbConnection = mongoose.connect(process.env.MONGO_URI);
  }
  return dbConnection;
}

// Every /api request makes sure the DB is connected before the routes run.
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Health check - open this URL in a browser to confirm the deploy worked.
app.get('/', (req, res) => res.json({ status: 'Todo API is running' }));

app.use('/api/todos', todoRoutes);

// Central error handler - returns JSON instead of an HTML crash page.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Something went wrong' });
});

// Local development: listen on a port. On Vercel this block is skipped and
// the exported app is run as a serverless function instead.
if (require.main === module) {
  connectDB()
    .then(() => {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () =>
        console.log(`Server running on http://localhost:${PORT}`)
      );
    })
    .catch((err) => {
      console.error('MongoDB connection failed:', err.message);
      process.exit(1);
    });
}

module.exports = app;
