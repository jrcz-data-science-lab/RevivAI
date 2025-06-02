FROM node:lts AS base
WORKDIR /app

ARG PUBLIC_OLLAMA_API_URL="http://localhost:11434/api"
ARG PUBLIC_OLLAMA_API_MODEL="phi4:latest"

COPY package.json package-lock.json ./

# Install only dependencies, required for production
FROM base AS prod-deps
RUN npm install --omit=dev

# Install all dependencies for building the application.
# Ignores package-lock.json, to fix multi-platform issues (https://github.com/vitejs/vite/issues/15167)
FROM base AS build-deps
RUN rm -rf package-lock.json
RUN npm install

# Build the application
FROM build-deps AS build
COPY . .
ENV PUBLIC_OLLAMA_API_URL=$PUBLIC_OLLAMA_API_URL
ENV PUBLIC_OLLAMA_API_MODEL=$PUBLIC_OLLAMA_API_MODEL
RUN npm run build

# Runtime image
FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=8080
EXPOSE 8080
CMD ["node", "./dist/server/entry.mjs"]