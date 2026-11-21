# Render Backend Deployment

The backend is in the `server` directory and can be deployed as a Render Web Service.

## Render settings

| Setting | Value |
| --- | --- |
| Root Directory | `server` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Health Check Path | `/health` |

The production backend URL will have this format:

```text
https://<your-render-service-name>.onrender.com
```

The current application does not provide a Render service name. Use the exact URL shown by Render after creating the service.

## Environment variables

Configure these variables in the Render dashboard. Never commit their values.

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | Set to `production` |
| `PORT` | Render normally sets this automatically; `5000` is the local fallback |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign and verify JWT authentication |
| `CLIENT_URL` | Comma-separated Vercel origin(s), for example `https://your-project.vercel.app` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `STRIPE_SECRET_KEY` | Stripe secret key for the selected environment |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |

`MONGO_URI` is supported as a legacy fallback, but `MONGODB_URI` is recommended for new deployments. `FRONTEND_URL` is also retained as a legacy fallback for CORS configuration, while `CLIENT_URL` is the preferred variable.

For MongoDB Atlas:

1. Create a database user and obtain the Atlas connection string.
2. Replace the placeholder credentials in the connection string.
3. Allow access from Render. Atlas IP allowlists must include the network used by the Render service.

## Deploying

1. Create a Render Web Service from this repository.
2. Set the root directory to `server`.
3. Set the build command to `npm install`.
4. Set the start command to `npm start`.
5. Add the environment variables listed above.
6. Deploy the service and wait until the service is healthy.

## Verify the health endpoint

After deployment, open:

```text
https://<your-render-service-name>.onrender.com/health
```

The expected response is:

```json
{
  "status": "awake",
  "message": "Backend is running successfully",
  "timestamp": "ISO_DATE"
}
```

The endpoint does not query MongoDB, so it can confirm that the HTTP process is responding.

## Configure Vercel

Set the Vercel frontend API and Socket.IO environment variable to the deployed Render origin:

```env
VITE_API_BASE_URL=https://<your-render-service-name>.onrender.com
```

Set `CLIENT_URL` on Render to the exact Vercel frontend origin, without a trailing path:

```env
CLIENT_URL=https://your-project.vercel.app
```

If multiple frontend domains are used, provide comma-separated origins. Do not include credentials in the origin value.

## Stripe webhook

Register the Render webhook endpoint in Stripe:

```text
https://<your-render-service-name>.onrender.com/api/payments/stripe-webhook
```

Set the resulting signing secret as `STRIPE_WEBHOOK_SECRET` on Render.

## Free-tier wake-up behavior

Render Free services can sleep when inactive. The Vercel frontend handles this automatically:

1. Send `GET /health` when a visitor opens the Vercel frontend.
2. Show the application immediately when the request succeeds.
3. Show a server wake-up screen while the backend is unavailable or still starting.
4. Retry `GET /health` every 3 seconds.
5. Display elapsed waiting time.
6. Automatically continue when the backend responds successfully.
7. Provide a manual retry option after a reasonable timeout.

## Socket.IO

The existing Socket.IO HTTP server and event handlers remain unchanged. Both WebSocket and polling transports are enabled. The existing frontend may continue using WebSocket transport, while Socket.IO reconnection defaults remain active.
