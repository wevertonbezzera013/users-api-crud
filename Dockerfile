# Use an official Node.js runtime as a base image
FROM node

# Set the working directory in the container
WORKDIR /home/node/api

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

RUN npm run build

# Expose the port that the application will run on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start"]
