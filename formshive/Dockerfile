# Stage 1: Build the project
FROM node:22 AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --production=false

# Copy the rest of the project
COPY . .

# Build the project
RUN npm run build

# Stage 2: Run the project
FROM node:22-alpine

WORKDIR /app

# Copy the built project from the previous stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# Expose the desired port (replace 3000 with the actual port used by your project)
EXPOSE 3000

# Start the project
CMD ["node", "dist/index.js"]
