const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const appRoutes = require('./routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan('dev'));

app.use('/api', appRoutes);
app.get('/', (req, res) => res.json({ message: 'Marketplace API running' }));

app.use(errorHandler);
module.exports = app;