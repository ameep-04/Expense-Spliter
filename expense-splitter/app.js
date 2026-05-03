const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

app.use('/api/auth',    require('./src/routes/authRoutes'));
app.use('/api/group',   require('./src/routes/groupRoutes'));
app.use('/api/expense', require('./src/routes/expenseRoutes'));
app.use('/api/balance', require('./src/routes/balanceRoutes'));
app.use('/api/settle',  require('./src/routes/settleRoutes'));

app.get('/health', function(req, res) {
  res.json({ status: 'OK' });
});

app.use(function(req, res) {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;