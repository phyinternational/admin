# CORS Proxy for Local Development

This is a simple CORS proxy for local development when you need to make API calls to backends that don't have CORS enabled.

## Usage

### Option 1: Use Vite's Built-in Proxy (Recommended)

The Vite development server is already configured to proxy API requests. In the main project:

1. Make API requests to `/api/*` instead of directly to the backend URL
2. Vite will proxy these requests to the backend without CORS issues

This is already set up in the Axios instance configuration.

### Option 2: Run a Local CORS Proxy (If needed)

If the Vite proxy doesn't work for your use case:

1. Install dependencies:
   ```
   cd cors-proxy
   npm install
   ```

2. Start the proxy:
   ```
   npm start
   ```

3. The proxy will run on port 8080 by default
4. Use the proxy by prefixing your API URL: `http://localhost:8080/http://your-api-url`

## Configuration

You can configure the proxy by setting environment variables:

- `PROXY_PORT`: Port to run the proxy on (default: 8080)
- `PROXY_HOST`: Host to bind to (default: 0.0.0.0)

Create a `.env` file in the cors-proxy directory to set these variables.
