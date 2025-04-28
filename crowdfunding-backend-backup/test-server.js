/**
 * Script to test if the server is running
 */

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/health-check',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);

  res.on('data', (chunk) => {
    console.log(`Response: ${chunk}`);
  });
});

req.on('error', (error) => {
  console.error(`Error: ${error.message}`);
});

req.end();
