const awsServerlessExpress = require('aws-serverless-express');
const server = require('./dist/mymasterbook-portal/server/main').app();
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

const binaryMimeTypes = [
  'application/javascript',
  'application/json',
  'application/octet-stream',
  'application/xml',
  'application/manifest+json',
  'application/x-font-ttf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/x-icon',
  'image/svg+xml',
  'text/comma-separated-values',
  'text/css',
  'text/html',
  'text/javascript',
  'text/plain',
  'text/text',
  'text/xml',
  'font/opentype',
  'font/sfnt',
  'font/ttf',
  'font/woff',
  'font/woff2'
];

server.use(awsServerlessExpressMiddleware.eventContext());
const serverProxy = awsServerlessExpress.createServer(
  server,
  null,
  binaryMimeTypes
);

module.exports.ssrserverless = (event, context) =>
  awsServerlessExpress.proxy(serverProxy, event, context);
