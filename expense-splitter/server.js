require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5001;

connectDB().then(function() {
  app.listen(PORT, function() {
    console.log('Server running on port ' + PORT);
  });
});

process.on('unhandledRejection', function(err) {
  console.error('Error: ' + err.message);
  process.exit(1);
});