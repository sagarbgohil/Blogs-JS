# Dockerfile for each service (auth-service and blog-service)

# Use Node.js official image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all service files
COPY . .

# Make entrypoint.sh executable
RUN chmod +x entrypoint.sh

# Set entrypoint
ENTRYPOINT ["./entrypoint.sh"]

# Expose the service port
EXPOSE 3001 

# Start the app
CMD ["npm", "run", "start"]
