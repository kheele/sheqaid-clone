#FROM --platform=windows/arm64/v8 stefanscherer/node-windows
#
## Change the working directory on the Docker image to /app
#WORKDIR /app
#
## Copy package.json and package-lock.json to the /app directory
#COPY package.json package-lock.json ./
#
## Install dependencies
#RUN npm install --production
#
## Copy the rest of project files into this image
#COPY . .
#
## Expose application port
#EXPOSE 5003
#
## Start the application
#CMD npm start

# Use the official Node.js image for Windows
FROM mcr.microsoft.com/windows/servercore:ltsc2019
#FROM node:lts-windowsservercore

# Set the working directory in the container
WORKDIR C:\\app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install Node.js dependencies
#RUN npm install
CMD ["npm", "install"]

# Copy the rest of the application code to the container
COPY . .

# Expose the port your app will run on (replace 3000 with your desired port)
EXPOSE 5003

# Command to run your application (replace 'app.js' with your entry point)
#CMD ["node", "app.js"]
CMD ["npm", "start"]
#npm start