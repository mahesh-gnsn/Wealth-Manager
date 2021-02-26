const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet');
require('dotenv/config');
const { Logger } = require('./utils/logger');
const logger = new Logger(process.env.logLevel);


// ROUTES
const staticRoutes = require('./routes/static');
const stockRoutes = require('./routes/stock');
const unauthorizedMessage = {
    success: false,
    message: "Unauthorized Usage"
}

// MIDDLEWARES
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use('/static', staticRoutes);
app.use('/stock', stockRoutes);

// Initialize MongoDB with mongoose
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, () => {
    logger.debug("DB connected");
});


// Invoke Server
const port = process.env.PORT || 3000;
app.listen(port);

