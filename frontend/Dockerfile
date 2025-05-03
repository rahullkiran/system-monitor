FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the frontend files
COPY . .

# Expose React default port
EXPOSE 3000

# Start React app
CMD ["npm", "start"]
