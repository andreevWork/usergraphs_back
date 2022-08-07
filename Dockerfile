FROM node:16.3.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Install app dependencies
RUN npm ci

# Bundle app source
COPY . .

ENV NODE_ENV production

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "npm", "run", "start:prod" ]
