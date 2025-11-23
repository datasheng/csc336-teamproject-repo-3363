# /frontend/Dockerfile

# 1. Use an up-to-date Node.js image compatible with Vite 7
FROM node:22-alpine

# 2. Set the working directory
WORKDIR /app

# 3. Copy package.json and lockfile, then install deps
COPY package.json package-lock.json . 
RUN npm ci || npm install

# 4. Copy all frontend code
COPY . .

# 5. Expose Vite's default port
EXPOSE 5173

# 6. Start the dev server (Key: --host is needed to be accessible externally)
CMD ["sh", "-lc", "npm ci || npm install && npm run dev -- --host"]