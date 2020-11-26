FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci --only=production
# If you are not building app for prod use npm install

# Copy app src files
COPY . .

# Expose service port
EXPOSE 8080

CMD [ "node", "app.js" ]