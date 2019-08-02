FROM node:8.16.0-alpine

ARG BUILD_NUMBER
ARG GIT_REF
ARG GIT_DATE
ARG NODE_ENVIRONMENT

# Create app directory
WORKDIR /home/node/app


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./


RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make python curl && \
  npm install --quiet node-gyp -g && \
  npm install --quiet && \
  apk del native-deps


# Copy over files to container
COPY . /home/node/app


# Build assets
RUN NODE_ENV=${NODE_ENVIRONMENT} npm run build


# Record build number
RUN BUILD_NUMBER=${BUILD_NUMBER} GIT_REF=${GIT_REF} GIT_DATE=${GIT_DATE} npm run record-build-info

