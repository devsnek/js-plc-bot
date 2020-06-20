'use strict';

/* eslint-disable no-console */

require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const WebSocket = require('ws');

function workbenchWs(url) {
  const ws = new WebSocket(url);
  ws.onopen = () => console.log('WS Open');
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    console[data[0].method]('PYLON LOG:', ...data[0].data);
  };
  ws.onerror = console.error;
  ws.onclose = () => workbenchWs(url);
}

fetch(`https://pylon.bot/api/deployments/${process.env.DEPLOYMENT_ID}`, {
  method: 'POST',
  headers: {
    'Authorization': process.env.API_TOKEN,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    script: {
      contents: fs.readFileSync('./dist/bundle.js', 'utf8'),
      project: {
        files: [{ path: '/main.ts', content: 'don\'t edit this lol' }],
      },
    },
  }),
}).then((r) => r.json())
  .then(({ workbench_url: workbenchEndpoint }) => {
    console.log('Published!');
    workbenchWs(workbenchEndpoint);
  })
  .catch(console.error);
