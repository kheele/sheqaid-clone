#FROM --platform=linux/arm64/v8 oven/bun
FROM --platform=linux/arm64/v8 node:18-slim

# Change the working directory on the Docker image to /app
WORKDIR /app

# Copy package.json and package-lock.json to the /app directory
COPY package.json ./
#COPY package.json package-lock.json ./
COPY ./external-modules/ ./node_modules/

# Install dependencies
#RUN bun install
RUN npm i --force --legacy-peer-deps

# Copy the rest of project files into this image
COPY . .

# Expose application port
EXPOSE 5000

# Start the application
#CMD bun run start
CMD npm start