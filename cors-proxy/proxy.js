// CORS Proxy server for local development using Express
import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize dotenv
dotenv.config({ path: join(__dirname, '.env') });

// Default configuration
const PORT = 8080;
const HOST = '0.0.0.0';
const TARGET = 'http://localhost:5000';

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.url}`);
  next();
});

// Create proxy middleware
app.use('/', createProxyMiddleware({
  target: TARGET,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Remove /api prefix when forwarding
  },
  onProxyReq: (proxyReq, req, res) => {
    // Add headers here if needed
    proxyReq.setHeader('X-Forwarded-For', req.ip);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end(`Proxy error: ${err.message}`);
  }
}));

// Start server
app.listen(PORT, HOST, () => {
  console.log(`CORS Proxy running on ${HOST}:${PORT}`);
  console.log(`Proxying requests to: ${TARGET}`);
  console.log(`Example usage: http://localhost:${PORT}/api/product/category/all`);
});
