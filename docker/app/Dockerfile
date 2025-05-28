FROM node:22-alpine AS build

RUN addgroup -S app && adduser -S -G app app
USER app
WORKDIR /app

COPY --chown=app:app package*.json ./

RUN npm install --no-audit --no-optional \
  && npm install @nestjs/cli --save-dev \
  && npm cache clean --force

COPY --chown=app:app . .

RUN npm run build \
  && npm prune --production

FROM node:22-alpine
LABEL org.opencontainers.image.title="jspay" \
      org.opencontainers.image.version="v1.0.0" \
      org.opencontainers.image.authors="Gustavo Oliveira"

RUN addgroup -S app && adduser -S -G app app
USER app
WORKDIR /app

ENV NODE_ENV=prod \
    PORT=3000

COPY --from=build --chown=app:app /app ./

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

ENTRYPOINT ["npm", "run", "start:prod"]
