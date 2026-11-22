FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

# Dependencies come from the root package.json
COPY package*.json ./
RUN npm ci --omit=dev

# App code and API docs
COPY server ./server
COPY openapi.yaml ./openapi.yaml

USER node
EXPOSE 5000

CMD ["node", "server/src/index.js"]