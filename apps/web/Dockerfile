FROM node:20-alpine
WORKDIR /app
COPY package*.json pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/
RUN npm install -g pnpm && pnpm install --filter web...
COPY apps/web apps/web
WORKDIR /app/apps/web
RUN pnpm build
CMD ["pnpm", "start"]
