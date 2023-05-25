FROM node:18-alpine

RUN apk add --no-cache git
RUN apk add g++ make py3-pip
RUN npm i -g pnpm
RUN npm install grpc-tools node-pre-gyp canvas -g

