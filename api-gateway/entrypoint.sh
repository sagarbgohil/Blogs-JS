#!/bin/bash

# Entrypoint script for each service

# Install dependencies
echo "Installing dependencies..."
npm install

# Run database migrations or other setup tasks if needed
# Example: npx sequelize-cli db:migrate or similar

# Start the service
echo "Starting the service..."
npm start
