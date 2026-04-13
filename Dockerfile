FROM node:20-alpine AS backend-build
WORKDIR /app/backend
ENV npm_config_update_notifier=false

COPY backend/package.json backend/package-lock.json ./
COPY backend/tsconfig.json ./
COPY backend/src ./src
RUN npm install
RUN npm run build

FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
ENV npm_config_update_notifier=false

COPY frontend/package.json frontend/package-lock.json ./
COPY frontend/tsconfig.json frontend/next.config.ts frontend/postcss.config.mjs frontend/tailwind.config.ts ./
COPY frontend/public ./public
COPY frontend/src ./src
RUN npm install
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app

RUN apk add --no-cache bash

COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules
COPY --from=backend-build /app/backend/package.json ./backend/package.json

COPY --from=frontend-build /app/frontend/.next ./frontend/.next
COPY --from=frontend-build /app/frontend/node_modules ./frontend/node_modules
COPY --from=frontend-build /app/frontend/package.json ./frontend/package.json
COPY --from=frontend-build /app/frontend/next.config.ts ./frontend/next.config.ts
COPY --from=frontend-build /app/frontend/public ./frontend/public

COPY docker-start.sh ./docker-start.sh
RUN chmod +x ./docker-start.sh

EXPOSE 3000
ENV NODE_ENV=production
CMD ["./docker-start.sh"]
