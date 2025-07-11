# Use Node.js official image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json separately to leverage Docker caching
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Make entrypoint.sh executable
RUN chmod +x entrypoint.sh

# Set entrypoint
ENTRYPOINT ["./entrypoint.sh"]

# Expose the service port
EXPOSE 3001

# Start the app
CMD ["npm", "start"]
