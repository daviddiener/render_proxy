# Render-Proxy Server

A simple express.js server which acts as a proxy for the [render](https://render.com/) api. I use it on my [personal website](https://www.daviddiener.de/) to fetch and display the status of my render servers.

## Local Development
For local development the following process environments have to be set
- process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
- process.env.RENDER_TOKEN = '<RENDER_TOKEN>';

```
npm i
npm run dev
```

## Deployment
Set your Render Token
- process.env.RENDER_TOKEN = '<RENDER_TOKEN>';

```
npm i
npm run start
```
