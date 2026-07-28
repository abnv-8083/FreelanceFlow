# Step 1: Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Build Vite frontend and compile TypeScript
RUN npm run build

# Expose port process.env.PORT || 5000
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Start Node backend server serving frontend static assets
CMD ["npm", "start"]
