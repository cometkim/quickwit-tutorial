FROM node:26-bookworm-slim

WORKDIR /app

COPY . .

RUN --mount=type=cache,target=/root/.npm/_cacache \
  npm install

EXPOSE 4000

ENV NODE_OPTIONS="--loader=@opentelemetry/instrumentation/hook.mjs --import /app/src/instrumentation.js"
CMD ["/app/src/server.js"]
