const express = require('express');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
require('./core/models');
const {setHeaders} = require('./core/middleware');
const {addCrudRoutes} = require('./core/middleware/addCrudRoutes');

const PORT = process.env.PORT || 3005;

if (!process.env.PORT) process.env.PORT = PORT;

const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({tracing: true}),
    new Tracing.Integrations.Express({app}),
  ],
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  release: `${process.env.npm_package_name}@${process.env.npm_package_version}`,
});

app.use(Sentry.Handlers.requestHandler({ip: true}));
app.use(Sentry.Handlers.tracingHandler());
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(cors());
app.use(setHeaders);

// Set core routes
app.use('/api/user', require('./core/routes/UserRoutes'));

// Set crud routes
addCrudRoutes(app);

// Set app routes
//app.use('/api/examples', require('./app/routes/ExamplesRoutes'));

// Debug routes
app.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('My first Sentry error!');
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

app.use(Sentry.Handlers.errorHandler());

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
