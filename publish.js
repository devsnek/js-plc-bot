'use strict';

/* eslint-disable no-console */

require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const WebSocket = require('ws');

function deserialize(value) {
  if (typeof value === 'object' && value !== null) {
    switch (value['@t']) {
      case '[[undefined]]':
        return undefined;
      case 'Function': {
        const f = function renameMe() {};
        Object.defineProperty(f, 'name', {
          value: value.data.name,
        });
        return f;
      }
      case 'BigInt':
        return BigInt(value.data.value);
      default:
        break;
    }
    if (Array.isArray(value)) {
      return value.map(deserialize);
    }
    return Object.fromEntries(Object.entries(value)
      .map(([k, v]) => {
        if (typeof k === 'string' && k.startsWith('#') && k.endsWith('@t')) {
          k = k.slice(1);
        }
        return [k, deserialize(v)];
      }));
  }
  return value;
}

function workbenchWs(url) {
  const ws = new WebSocket(url);
  ws.onopen = () => console.log('WS Open');
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    console[data[0].method]('PYLON LOG:', ...data[0].data.map(deserialize));
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
