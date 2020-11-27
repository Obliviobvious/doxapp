FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install
# If building for prod instead run npm ci --only=production

# Copy app src files
COPY . .

# Expose service port
EXPOSE 80

CMD [ "node", "app.js" ]