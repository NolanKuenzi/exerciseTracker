const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// data-base
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true }).catch((error) => { console.log(error); });

const app = express();
const routes = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({optionSuccessStatus: 200}));
 
// Point static path to dist

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', routes);

/** Get port from environment and store in Express. */
const port = process.env.PORT || '3000';
app.set('port', port);

/** Create HTTP server. */
const server = http.createServer(app);
/** Listen on provided port, on all network interfaces. */
server.listen(port, () => console.log(`Server Running on port ${port}`));