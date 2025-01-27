# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir pymongo

# Expose the port the app will run on (adjust if necessary)
EXPOSE 8000

# Define environment variables (adjust as needed)
ENV MONGO_URI=mongodb://mongo:27017/Wolt

# Run the script when the container starts
CMD ["python", "test.py"]
