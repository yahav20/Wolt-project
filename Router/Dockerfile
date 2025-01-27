# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json from the correct location
COPY Router/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY Router/ ./

# Expose the application port
EXPOSE ${ROUTER_PORT}

# Command to run the application
CMD ["npm", "start"]
