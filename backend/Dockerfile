# Use a Node.js base image with the desired version
FROM --platform=linux/amd64 node:14

# Set the working directory for the backend
WORKDIR /app/backend

# Copy backend files to the container
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend files to the container
COPY . .

# Expose the port for the backend
EXPOSE 3000

# Start the backend
CMD ["npm", "start"]
