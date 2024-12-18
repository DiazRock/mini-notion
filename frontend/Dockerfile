# Use official Node.js image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

# Copy application files
COPY . .

# Build the React application
RUN npm run build

RUN npm install serve@14.2.4

# Expose the React app port
EXPOSE 3005

# Serve the app using serve
CMD ["npm", "run", "start"]
