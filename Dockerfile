FROM node:18-alpine AS base

RUN apk add --no-cache git g++ make py3-pip
RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile --prefer-frozen-lockfile

RUN pnpm -filter client rin generate

