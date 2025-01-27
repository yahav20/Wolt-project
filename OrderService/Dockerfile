# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json from the correct location
COPY OrderService/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY OrderService/ ./

# Expose the application port
EXPOSE ${ORDERS_PORT}

# Command to run the application
CMD ["npm", "start"]
