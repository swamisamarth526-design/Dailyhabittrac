# Deploying DailyXP on Railway

## Backend service (Node + TypeScript)

1. In Railway, create a new project and select the `backend` folder as the service root.
2. Set the following environment variables in Railway:
   - `PORT` (optional, Railway provides a port automatically)
   - `MONGO_URI`
   - `JWT_SECRET`
   - `REDIS_URL`
3. Railway will install dependencies and run `npm run build` automatically because `backend/package.json` includes `postinstall`.
4. Railway will start the backend with `npm start`.

## Frontend service (Next.js)

1. In Railway, create a second service and select the `frontend` folder as the service root.
2. Set the environment variable:
   - `NEXT_PUBLIC_SERVER_URL=https://<your-backend-service-url>/`
3. Railway will install dependencies and run `npm run build` automatically because `frontend/package.json` includes `postinstall`.
4. Railway will start the frontend with `npm start`.

## Important notes

- `backend/.env.example` and `frontend/.env.example` are included for reference.
- The backend now waits for a successful database connection before listening for requests.
- Use `npm start` to run the services in production. Do not use `npm star`.
- If you deploy both services, make sure the frontend `NEXT_PUBLIC_SERVER_URL` points to the deployed Railway backend URL.

## Docker deployment (single Railway container)

You can deploy the monorepo as one Railway service using the root `Dockerfile`.

1. In Railway, create a new project and choose Docker deployment from the root folder.
2. Railway will build the image using the root `Dockerfile`.
3. Set these environment variables in Railway:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `REDIS_URL`
   - `NEXT_PUBLIC_SERVER_URL` (optional; if not set, the frontend falls back to relative API paths)
4. Railway exposes port `3000` and routes traffic to the frontend.

The Docker container starts both services:
- backend on `5001`
- frontend on `3000`

Backend API requests from the frontend resolve via `NEXT_PUBLIC_SERVER_URL` if provided, or relative routes if not.
