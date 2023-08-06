# Use a Node.js base image with the desired version
FROM --platform=linux/amd64 node:14

# Set the working directory for the frontend
WORKDIR /app/frontend

# Copy frontend files to the container
COPY package*.json ./
COPY public ./public
COPY src ./src

# Install frontend dependencies
RUN npm install

# Expose the port for the frontend
EXPOSE 3001

# Start the frontend
CMD ["npm", "start"]
