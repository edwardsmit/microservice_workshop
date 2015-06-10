# Dockerfile to build a Node.js runtime for Rental Car Offers microservices
# Version 0.0.1

FROM node:latest
MAINTAINER Ben Booth <bkbooth@gmail.com>

# Setup application directory
ENV APP_DIR /usr/src/app/
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

# Copy all application files
COPY . ${APP_DIR}

# Install nodemon
RUN npm install -g nodemon && \
    npm cache clear

# Run with nodemon
CMD nodemon --exec "npm run monitor"
